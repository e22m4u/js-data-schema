import {DataSchema} from '../data-schema.js';
import {ValidationError} from '../errors/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {EmptyValuesService} from '@e22m4u/js-empty-values';

/**
 * Is required validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 * @param container
 */
export function isRequiredValidator(
  value: unknown,
  schema: DataSchema,
  sourcePath: string | undefined,
  container: ServiceContainer,
) {
  if (!schema.required) return;
  const emptyValuesService = container.get(EmptyValuesService);
  const isEmpty = emptyValuesService.isEmptyByType(schema.type, value);
  if (!isEmpty) return;
  if (sourcePath) {
    throw new ValidationError(
      'Value of %v is required, but %v given.',
      sourcePath,
      value,
    );
  } else {
    throw new ValidationError('Value is required, but %v given.', value);
  }
}
