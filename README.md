# @e22m4u/ts-data-schema

*English | [Русский](./README-ru.md)*

Data validation and type casting for TypeScript.

## Key Features

- **DataValidator** - Validation service with built-in validators
  for strings, numbers, boolean values, arrays and objects.
- **DataTypeCaster** - Flexible type casting mechanism supporting
  all basic types.
- Extensible architecture allowing custom validators and type casters.
- Detailed debugging capabilities.

## Usage

Data validation.

```ts
import {DataType} from '@e22m4u/ts-data-schema';
import {DataValidator} from '@e22m4u/ts-data-schema';

const validator = new DataValidator();

// define schema
const schema = {
  type: DataType.STRING,
  // ...additional options
};

// validate value according to schema
validator.validate(value, schema);
```

Type casting.

```ts
import {DataType} from '@e22m4u/ts-data-schema';
import {DataTypeCaster} from '@e22m4u/ts-data-schema';

const typeCaster = new DataTypeCaster();

// define schema
const schema = {
  type: DataType.NUMBER,
  // ...additional options
};

// cast type according to schema
// or throw TypeCastError
const result1 = typeCaster.cast(value, schema);

// cast type according to schema
// or return value unchanged
const result2 = typeCaster.cast(value, schema, {
  noTypeCastError: true,
});
```

## DataSchema

`DataSchema` is an object that defines the structure for data validation
and type casting. The schema provides a flexible way to describe the shape
and constraints of your data. Let's look at the schema object definition.

```ts
type DataSchema = {
  type: DataType;
  items?: DataSchema;
  properties?: {[key: string]: DataSchema};
  required?: boolean;
  validate?: CallableValidator | CallableValidator[];
};
```

#### type

Defines the data type using the constants listed below.

- `DataType.ANY` - accepts any type
- `DataType.STRING` - string values
- `DataType.NUMBER` - numeric values
- `DataType.BOOLEAN` - boolean values
- `DataType.ARRAY` - array values
- `DataType.OBJECT` - object values

```ts
const schema = {
  type: DataSchema.STRING,
}
```

#### items

Used for arrays to define the schema of array elements.
This is a nested `DataSchema` that describes each item in the array.

```ts
const schema = {
  type: DataSchema.ARRAY,
  items: {type: DataSchema.STRING},
}
```

#### properties

Used for objects to define the schema of object properties.
Each property is a key-value pair where the value is a nested
`DataSchema`.

```ts
const schema = {
  type: DataSchema.OBJECT,
  properties: {
    foo: {type: DataSchema.STRING},
    bar: {type: DataSchema.NUMBER},
  },
}
```

#### required

Indicates if the value is required. When `true`, the value cannot
be `undefined` or `null`.

```ts
const schema = {
  type: DataSchema.ANY,
  required: true,
}
```

#### validate

Custom validation function(s) to apply additional rules. Can be
a single function or an array of functions.

```ts
const schema = {
  type: DataSchema.ANY,
  validate: (value: unknown) => {
    if (typeof value !== 'string')
      throw new Error('A string required.');
  },
}
```

## Debugging

Enable logs by setting the `DEBUG` environment variable.

```bash
DEBUG=tsDataSchema* npm run test
```

## Tests

Run the test suite.

```bash
npm run test
```

## License

MIT
