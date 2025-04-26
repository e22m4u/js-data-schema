/**
 * To PascalCase (UpperCamelCase).
 * Converts a string to camel case with the first letter capitalized.
 *
 * @param input The string to convert.
 * @returns The PascalCase string.
 */
export function toPascalCase(input) {
    // обработка случая с пустой строкой или null/undefined
    if (!input)
        return '';
    return (input
        // splits camelCase words into separate words
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // splits numbers and words
        .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
        // replaces dashes, underscores, and special characters with spaces
        .replace(/[-_]+|[^\p{L}\p{N}]/gu, ' ')
        // converts the entire string to lowercase
        .toLowerCase()
        // capitalizes the first letter of each word
        .replace(/(?:^|\s)(\p{L})/gu, (_, letter) => letter.toUpperCase())
        // removes all spaces
        .replace(/\s+/g, ''));
}
