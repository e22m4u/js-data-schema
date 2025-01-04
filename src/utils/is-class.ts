import {Constructor} from '../types.js';

/**
 * Is class.
 *
 * @param value
 */
export function isClass<T extends object>(
  value: unknown,
): value is Constructor<T> {
  // check if value exists and is a function
  if (typeof value !== 'function') return false;
  // check for class syntax characteristics
  const stringified = value.toString();
  // class declarations and expressions start with 'class' keyword
  return stringified.startsWith('class');
}
