/**
 * Is class.
 *
 * @param value
 */
export function isClass(value) {
    // check if value exists and is a function
    if (typeof value !== 'function')
        return false;
    // check for class syntax characteristics
    const stringified = value.toString();
    // class declarations and expressions start with 'class' keyword
    return stringified.startsWith('class');
}
