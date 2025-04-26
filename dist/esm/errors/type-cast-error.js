import { format } from '@e22m4u/js-format';
import { dataTypeFrom } from '../data-schema.js';
import { toPascalCase } from '../utils/index.js';
/**
 * Type cast error.
 */
export class TypeCastError extends Error {
    value;
    targetType;
    constructor(value, targetType) {
        const sourceType = dataTypeFrom(value);
        const message = format('Unable to cast %s to %s.', sourceType ? toPascalCase(sourceType) : sourceType, toPascalCase(targetType));
        super(message);
        this.value = value;
        this.targetType = targetType;
    }
}
