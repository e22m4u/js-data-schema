import {PlainObject} from './types.js';
import {Errorf} from '@e22m4u/js-format';
import {DataType} from './data-schema.js';
import {DataSchema} from './data-schema.js';
import {toPascalCase} from './utils/index.js';
import {dataTypeFrom} from './data-schema.js';
import {TypeCastError} from './errors/index.js';
import {typeCastToArray} from './type-casters/index.js';
import {typeCastToNumber} from './type-casters/index.js';
import {typeCastToString} from './type-casters/index.js';
import {DebuggableService} from './debuggable-service.js';
import {typeCastToBoolean} from './type-casters/index.js';
import {typeCastToPlainObject} from './type-casters/index.js';

/**
 * Callable type caster.
 */
export type CallableTypeCaster<T = unknown> = (value: unknown) => T;

/**
 * Cast options.
 *
 * @property sourcePath A path like 'body.user.name' from which the value is obtained.
 * @property noTypeCastError Return a given value instead of throwing the TypeCastError.
 */
type TypeCastOptions = {
  sourcePath?: string;
  noTypeCastError?: boolean;
};

/**
 * Data type caster.
 */
export class DataTypeCaster extends DebuggableService {
  /**
   * Type caster map.
   *
   * @protected
   */
  protected readonly typeCasterMap = new Map<DataType, CallableTypeCaster>([
    [DataType.STRING, typeCastToString],
    [DataType.NUMBER, typeCastToNumber],
    [DataType.BOOLEAN, typeCastToBoolean],
    [DataType.ARRAY, typeCastToArray],
    [DataType.OBJECT, typeCastToPlainObject],
  ]);

  /**
   * Set type caster.
   *
   * @param type
   * @param caster
   */
  setTypeCaster(type: DataType, caster: CallableTypeCaster): this {
    const debug = this.getDebuggerFor(this.setTypeCaster);
    this.typeCasterMap.set(type, caster);
    debug('A type caster %v is set for %s type.', caster.name, type);
    return this;
  }

  /**
   * Get type caster.
   *
   * @param type
   */
  getTypeCaster(type: DataType): CallableTypeCaster {
    const typeCaster = this.typeCasterMap.get(type);
    if (typeCaster) return typeCaster;
    throw new Errorf('No type caster found for %s type.', type);
  }

  /**
   * Cast.
   *
   * @param value
   * @param schema
   * @param options
   */
  cast(value: unknown, schema: DataSchema, options?: TypeCastOptions): unknown {
    const debug = this.getDebuggerFor(this.cast);
    debug('Converting value type based on the given schema.');
    debug.inspect('Schema:', schema);
    debug.inspect('Value:', value);
    const sourcePath = options?.sourcePath;
    if (sourcePath) debug('Source path is %v.', sourcePath);
    const noTypeCastError = options?.noTypeCastError ?? false;
    if (noTypeCastError) debug('Type cast errors are disabled.');
    // если определение не имеет типа,
    // то преобразование пропускается
    if (!schema.type) {
      debug('Data schema does not have the type definition.');
      debug('Type casting is skipped.');
      return value;
    }
    const targetType = schema.type;
    // если значением является null или undefined,
    // то преобразование пропускается или выбрасывается
    // ошибка (в строгом режиме)
    if (value == null) {
      if (noTypeCastError) {
        debug('No type casting required for %v.', value);
        debug('Type casting is skipped.');
        return value;
      } else {
        throw new TypeCastError(value, targetType);
      }
    }
    // если целевой тип является ANY,
    // то преобразование пропускается
    const sourceType = dataTypeFrom(value);
    debug('Source type is %s.', toPascalCase(sourceType));
    debug('Target type is %s.', toPascalCase(targetType));
    if (targetType === DataType.ANY) {
      debug('No type casting required for Any.');
      debug('Type casting is skipped.');
      return value;
    }
    // если исходный тип не соответствует целевому,
    // то выполняется преобразование значения
    let newValue: unknown = value;
    if (sourceType !== targetType) {
      const caster = this.getTypeCaster(schema.type);
      try {
        newValue = caster(value);
      } catch (error) {
        if (noTypeCastError && error instanceof TypeCastError) {
          debug(error.message);
          debug('Type casting is skipped.');
          return value;
        }
        throw error;
      }
    }
    // если исходный тип соответствует целевому,
    // и не является массивом или объектом,
    // то значение возвращается без изменений
    else if (sourceType !== DataType.ARRAY && sourceType !== DataType.OBJECT) {
      debug('Source and target types are the same.');
      debug('Type casting skipped.');
      return value;
    }
    // если значение является массивом,
    // то выполняется рекурсивный обход
    // каждого элемента
    if (targetType === DataType.ARRAY && Array.isArray(newValue)) {
      debug('Type casting array items.');
      if (schema.items) {
        const valueAsArray = newValue as unknown[];
        for (const index in valueAsArray) {
          const elValue = valueAsArray[index];
          const elSchema = schema.items;
          const elSourcePath = sourcePath
            ? `${sourcePath}[${index}]`
            : `Array[${index}]`;
          valueAsArray[index] = this.cast(elValue, elSchema, {
            sourcePath: elSourcePath,
            noTypeCastError,
          });
        }
        debug('Items type casting completed.');
      } else {
        debug('No items schema specified.');
      }
    }
    // если значение является объектом,
    // то выполняется рекурсивный обход
    // каждого свойства
    if (
      schema.type === DataType.OBJECT &&
      newValue !== null &&
      typeof newValue === 'object' &&
      !Array.isArray(newValue)
    ) {
      debug('Type casting object properties.');
      if (schema.properties) {
        const valueAsObject = newValue as PlainObject;
        for (const propName in schema.properties) {
          const propSchema = schema.properties[propName]!;
          const propValue = valueAsObject[propName];
          const propSourcePath = sourcePath
            ? `${sourcePath}.${propName}`
            : propName;
          valueAsObject[propName] = this.cast(propValue, propSchema, {
            sourcePath: propSourcePath,
            noTypeCastError,
          });
        }
        debug('Properties type casting completed.');
      } else {
        debug('No properties schema specified.');
      }
    }
    if (sourceType !== targetType)
      debug(
        'Value cast from %s to %s.',
        toPascalCase(sourceType),
        toPascalCase(targetType),
      );
    debug.inspect('New value:', newValue);
    return newValue;
  }
}
