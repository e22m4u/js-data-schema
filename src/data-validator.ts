import {PlainObject} from './types.js';
import {Errorf} from '@e22m4u/js-format';
import {DataType} from './data-schema.js';
import {DataSchema} from './data-schema.js';
import {arrayTypeValidator} from './validators/index.js';
import {DebuggableService} from './debuggable-service.js';
import {isRequiredValidator} from './validators/index.js';
import {numberTypeValidator} from './validators/index.js';
import {objectTypeValidator} from './validators/index.js';
import {stringTypeValidator} from './validators/index.js';
import {booleanTypeValidator} from './validators/index.js';

/**
 * Callable validator.
 */
export type CallableValidator = (
  value: unknown,
  schema: DataSchema,
  sourcePath?: string,
) => void;

/**
 * Data validator.
 */
export class DataValidator extends DebuggableService {
  /**
   * Validators.
   *
   * @protected
   */
  protected readonly validatorMap: Set<CallableValidator> = new Set([
    stringTypeValidator,
    numberTypeValidator,
    booleanTypeValidator,
    arrayTypeValidator,
    objectTypeValidator,
    isRequiredValidator,
  ]);

  /**
   * Add validator.
   *
   * @param fn
   */
  addValidator(fn: CallableValidator): this {
    this.validatorMap.add(fn);
    this.debug('Validator %v is added.', fn.name);
    return this;
  }

  /**
   * Has validator.
   *
   * @param fn
   */
  hasValidator(fn: CallableValidator): boolean {
    return this.validatorMap.has(fn);
  }

  /**
   * Get validators.
   */
  getValidators(): CallableValidator[] {
    return Array.from(this.validatorMap.values());
  }

  /**
   * Remove validator.
   *
   * @param fn
   */
  removeValidator(fn: CallableValidator): this {
    if (this.validatorMap.has(fn)) {
      this.validatorMap.delete(fn);
      this.debug('Validator %v is removed.', fn.name);
      return this;
    }
    throw new Errorf('Unable to remove non-existent validator %v.', fn.name);
  }

  /**
   * Remove all validators.
   */
  removeAllValidators(): this {
    this.validatorMap.clear();
    return this;
  }

  /**
   * Validate.
   *
   * @param value
   * @param schema
   * @param sourcePath A path like 'body.user.name' from which the value.
   */
  validate(value: unknown, schema: DataSchema, sourcePath?: string): void {
    this.debug('Validation.');
    if (sourcePath) this.debug('Source path is %v.', sourcePath);
    // выполнение глобальных валидаторов
    const validators = this.getValidators();
    if (validators.length) {
      this.debug('%v global validators found.', validators.length);
      validators.forEach(fn => fn(value, schema, sourcePath));
      this.debug('Global validators are passed.');
    } else {
      this.debug('No global validators found.');
    }
    // выполнение локальных валидаторов
    let localValidators: CallableValidator[] = [];
    if (Array.isArray(schema.validate)) {
      localValidators = schema.validate;
    } else if (typeof schema.validate === 'function') {
      localValidators = [schema.validate];
    }
    if (localValidators.length) {
      this.debug('%v local validators found.', localValidators.length);
      localValidators.forEach(fn => fn(value, schema, sourcePath));
      this.debug('Local validators are passed.');
    } else {
      this.debug('No local validators found.');
    }
    // в случае массива, рекурсивно
    // проходим по каждому элементу
    if (
      schema.type === DataType.ARRAY &&
      schema.items &&
      Array.isArray(value)
    ) {
      this.debug('Starting array items validation.');
      const valueAsArray = value as unknown[];
      for (const index in valueAsArray) {
        const elValue = valueAsArray[index];
        const elSchema = schema.items;
        const elSourcePath = sourcePath
          ? `${sourcePath}[${index}]`
          : `Array[${index}]`;
        this.validate(elValue, elSchema, elSourcePath);
      }
      this.debug('Array items validation is done.');
    }
    // в случае объекта, рекурсивно
    // проходим по каждому свойству
    if (
      schema.type === DataType.OBJECT &&
      schema.properties &&
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      this.debug('Starting object properties validation.');
      const valueAsObject = value as PlainObject;
      for (const propName in schema.properties) {
        const propSchema = schema.properties[propName];
        const propValue = valueAsObject[propName];
        const propSourcePath = sourcePath
          ? `${sourcePath}.${propName}`
          : propName;
        this.validate(propValue, propSchema, propSourcePath);
      }
      this.debug('Object properties validation is done.');
    }
    this.debug('Validation of %v is done.', sourcePath);
  }
}
