import { Errorf, InvalidArgumentError } from '@e22m4u/js-format';
import { DataType } from './data-schema.js';
import { createColorizedDump } from '@e22m4u/js-debug';
import { arrayTypeValidator } from './validators/index.js';
import { DebuggableService } from './debuggable-service.js';
import { isRequiredValidator } from './validators/index.js';
import { numberTypeValidator } from './validators/index.js';
import { objectTypeValidator } from './validators/index.js';
import { stringTypeValidator } from './validators/index.js';
import { booleanTypeValidator } from './validators/index.js';
import { ValidationError } from './errors/validation-error.js';
/**
 * Data validator.
 */
export class DataValidator extends DebuggableService {
    /**
     * Validators.
     *
     * @protected
     */
    validatorMap = new Set([
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
    addValidator(fn) {
        const debug = this.getDebuggerFor(this.addValidator);
        this.validatorMap.add(fn);
        debug('Validator %v is added.', fn.name);
        return this;
    }
    /**
     * Has validator.
     *
     * @param fn
     */
    hasValidator(fn) {
        return this.validatorMap.has(fn);
    }
    /**
     * Get validators.
     */
    getValidators() {
        return Array.from(this.validatorMap.values());
    }
    /**
     * Remove validator.
     *
     * @param fn
     */
    removeValidator(fn) {
        if (this.validatorMap.has(fn)) {
            const debug = this.getDebuggerFor(this.removeValidator);
            this.validatorMap.delete(fn);
            debug('Validator %v is removed.', fn.name);
            return this;
        }
        throw new Errorf('Unable to remove non-existent validator %v.', fn.name);
    }
    /**
     * Remove all validators.
     */
    removeAllValidators() {
        this.validatorMap.clear();
        return this;
    }
    /**
     * Invoke validator.
     *
     * @param validator
     * @param value
     * @param schema
     * @param sourcePath
     * @param container
     */
    invokeValidator(validator, value, schema, sourcePath, container) {
        const res = validator(value, schema, sourcePath, container);
        const validatorName = (validator.name !== 'validator' &&
            validator.name !== 'validate' &&
            validator.name) ||
            undefined;
        if (res === false) {
            if (sourcePath) {
                if (validatorName) {
                    throw new ValidationError('Validator %v for path %v rejected the value %v.', validatorName, sourcePath, value);
                }
                else {
                    throw new ValidationError('Validation for path %v failed with the value %v.', sourcePath, value);
                }
            }
            else {
                if (validatorName) {
                    throw new ValidationError('Validator %v rejected the value %v.', validatorName, value);
                }
                else {
                    throw new ValidationError('Validation failed with the value %v.', value);
                }
            }
        }
        else if (res && typeof res === 'string') {
            throw new ValidationError(res);
        }
        else if (res instanceof Error) {
            throw res;
        }
        else if (res instanceof Promise) {
            throw new InvalidArgumentError('Asynchronous validator is not supported ' +
                'and should not return a Promise.');
        }
        else if (res != null && res !== true) {
            throw new InvalidArgumentError('User-specified validator should return one of values: ' +
                'Boolean, String, Error instance or undefined, ' +
                'but %v was given.', res);
        }
    }
    /**
     * Validate.
     *
     * @param value
     * @param schema
     * @param sourcePath A path like 'body.user.name' from which the value.
     */
    validate(value, schema, sourcePath) {
        const debug = this.getDebuggerFor(this.validate);
        const debugWo1 = debug.withOffset(1);
        debug('Validating a value against the given schema.');
        debug('Schema:');
        debugWo1(createColorizedDump(schema));
        debug('Value:');
        debugWo1(createColorizedDump(value));
        if (sourcePath)
            debug('Source path is %v.', sourcePath);
        // выполнение глобальных валидаторов
        const validators = this.getValidators();
        if (validators.length) {
            debug('%v global validators found.', validators.length);
            validators.forEach(fn => this.invokeValidator(fn, value, schema, sourcePath, this.container));
            debug('Global validators are passed.');
        }
        else {
            debug('No global validators found.');
        }
        // выполнение локальных валидаторов
        let localValidators = [];
        if (Array.isArray(schema.validate)) {
            localValidators = schema.validate;
        }
        else if (typeof schema.validate === 'function') {
            localValidators = [schema.validate];
        }
        if (localValidators.length) {
            debug('%v local validators found.', localValidators.length);
            localValidators.forEach(fn => this.invokeValidator(fn, value, schema, sourcePath, this.container));
            debug('Local validators are passed.');
        }
        else {
            debug('No local validators found.');
        }
        // в случае массива, рекурсивно
        // проходим по каждому элементу
        if (schema.type === DataType.ARRAY &&
            schema.items &&
            Array.isArray(value)) {
            debug('Validating array items.');
            const valueAsArray = value;
            for (const index in valueAsArray) {
                const elValue = valueAsArray[index];
                const elSchema = schema.items;
                const elSourcePath = sourcePath
                    ? `${sourcePath}[${index}]`
                    : `Array[${index}]`;
                this.validate(elValue, elSchema, elSourcePath);
            }
            debug('Array items validated.');
        }
        // в случае объекта, рекурсивно
        // проходим по каждому свойству
        if (schema.type === DataType.OBJECT &&
            schema.properties &&
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value)) {
            debug('Validating object properties.');
            const valueAsObject = value;
            for (const propName in schema.properties) {
                const propSchema = schema.properties[propName];
                const propValue = valueAsObject[propName];
                const propSourcePath = sourcePath
                    ? `${sourcePath}.${propName}`
                    : propName;
                this.validate(propValue, propSchema, propSourcePath);
            }
            debug('Object properties validated.');
        }
        if (sourcePath) {
            debug('Validation of %v is passed.', sourcePath);
        }
        else {
            debug('Validation passed.');
        }
    }
}
