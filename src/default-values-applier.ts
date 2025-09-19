import {PlainObject} from './types.js';
import {DataType} from './data-schema.js';
import {cloneDeep} from './utils/index.js';
import {DataSchema} from './data-schema.js';
import {toPascalCase} from './utils/index.js';
import {DebuggableService} from './debuggable-service.js';
import {EmptyValuesService} from '@e22m4u/js-empty-values';

/**
 * Default values applier.
 */
export class DefaultValuesApplier extends DebuggableService {
  /**
   * Apply default values if needed.
   *
   * @param value
   * @param schema
   * @param sourcePath
   */
  applyDefaultValuesIfNeeded(
    value: unknown,
    schema: DataSchema,
    sourcePath?: string,
  ) {
    const debug = this.getDebuggerFor(this.applyDefaultValuesIfNeeded);
    debug('Applying default values by the given schema.');
    debug.inspect('Schema:', schema);
    debug.inspect('Value:', value);
    if (sourcePath) debug('Source path is %v.', sourcePath);
    const valueType = schema.type ?? DataType.ANY;
    debug('Value type is %s.', toPascalCase(valueType));
    const isEmpty = this.getService(EmptyValuesService).isEmptyByType(
      valueType,
      value,
    );
    let resValue: unknown;
    // если входящее значение является пустым,
    // то используется значение по умолчанию
    // (при его наличии)
    if (isEmpty) {
      debug('Value is empty.');
      if (schema.default !== undefined) {
        // если значение по умолчанию является фабрикой,
        // то выполняется извлечение фабричного значения
        let defaultValue = schema.default;
        if (typeof schema.default === 'function') {
          debug('Extracting factory value.');
          defaultValue = schema.default();
        }
        resValue = cloneDeep(defaultValue);
        debug.inspect('Default value:', resValue);
      } else {
        debug('No default value specified.');
        resValue = cloneDeep(value);
      }
    } else {
      debug('Value is not empty.');
      resValue = cloneDeep(value);
    }
    // если схема данных описывает массив, и входящее
    // значение является массивом, то выполняется обход
    // каждого элемента для установки значений по умолчанию
    // (по необходимости)
    if (valueType === DataType.ARRAY && Array.isArray(resValue)) {
      debug('Applying default values to array items.');
      if (schema.items) {
        const valueAsArray = resValue as unknown[];
        for (const index in valueAsArray) {
          const elValue = valueAsArray[index];
          const elSchema = schema.items;
          const elSourcePath = sourcePath
            ? `${sourcePath}[${index}]`
            : `Array[${index}]`;
          valueAsArray[index] = this.applyDefaultValuesIfNeeded(
            elValue,
            elSchema,
            elSourcePath,
          );
        }
        debug('Default values applied to items.');
      } else {
        debug('No items schema specified.');
      }
    }
    // если схема данных описывает объект, и входящее
    // значение является объектом, то выполняется обход
    // каждого свойства для установки значений по умолчанию
    // (по необходимости)
    if (
      valueType === DataType.OBJECT &&
      resValue !== null &&
      typeof resValue === 'object' &&
      !Array.isArray(resValue)
    ) {
      debug('Applying default values to properties.');
      if (schema.properties) {
        const valueAsObject = resValue as PlainObject;
        for (const propName in schema.properties) {
          const propSchema = schema.properties[propName]!;
          const propValue = valueAsObject[propName];
          const propSourcePath = sourcePath
            ? `${sourcePath}.${propName}`
            : propName;
          valueAsObject[propName] = this.applyDefaultValuesIfNeeded(
            propValue,
            propSchema,
            propSourcePath,
          );
        }
        debug('Default values applied to properties.');
      } else {
        debug('No properties schema specified.');
      }
    }
    return resValue;
  }
}
