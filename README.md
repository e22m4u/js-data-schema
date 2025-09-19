# @e22m4u/ts-data-schema

Валидация данных и приведение типов для TypeScript.

## Содержание

- [Особенности](#особенности)
- [Установка](#установка)
- [Схема данных](#схема-данных)
  - [type](#type)
  - [items](#items)
  - [properties](#properties)
  - [required](#required)
  - [default](#default)
  - [validate](#validate)
- [Пустые значения](#пустые-значения)
- [Декораторы](#декораторы)
- [Примеры](#примеры)
- [Отладка](#отладка)
- [Тесты](#тесты)

## Особенности

- **DataValidator** - Сервис валидации со встроенной проверкой типов
  и системой пользовательских правил.
- **DataTypeCaster** - Сервис конвертации значений согласно схеме данных.
- **DefaultValuesApplier** - Сервис, заполняющий данные значениями
  по-умолчанию.
- Расширяемая архитектура, позволяющая добавлять пользовательские
  валидаторы и преобразователи типов.
- Подробная отладка.

## Установка

```bash
npm install @e22m4u/ts-data-schema
```

Модуль поддерживает ESM и CommonJS стандарты.

*ESM*

```js
import {DataValidator} from '@e22m4u/ts-data-schema';
```

*CommonJS*

```js
const {DataValidator} = require('@e22m4u/ts-data-schema');
```

## Схема данных

`DataSchema` является объектом, определяющим структуру для валидации
данных и приведения типов. Схема предоставляет гибкий способ описания
и ограничения входящих данных. Рассмотрим определение объекта схемы.

```ts
type DataSchema = {
  type: DataType;
  items?: DataSchema;
  properties?: {[key: string]: DataSchema};
  required?: boolean;
  default?: unknown;
  validate?: CallableValidator | CallableValidator[];
};
```

#### type

Определяет тип значения с помощью констант, указанных ниже.

- `DataType.ANY` - принимает любой тип;
- `DataType.STRING` - строковые значения;
- `DataType.NUMBER` - числовые значения;
- `DataType.BOOLEAN` - логические значения;
- `DataType.ARRAY` - массивы;
- `DataType.OBJECT` - объекты (не экземпляры);

```ts
import {DataType} from '@e22m4u/ts-data-schema';

const schema = {
  type: DataType.STRING,
}
```

#### items

Используется массивами для определения схемы элементов. Это вложенный
объект `DataSchema`, описывающий каждый элемент массива.

```ts
const schema = {
  type: DataType.ARRAY,
  items: {type: DataType.STRING},
}
```

#### properties

Используется объектами для определения схемы свойств. Каждое свойство
представляет собой пару ключ-значение, где значением является вложенный
объект `DataSchema`.

```ts
const schema = {
  type: DataType.OBJECT,
  properties: {
    foo: {type: DataType.STRING},
    bar: {type: DataType.NUMBER},
  },
}
```

#### required

Параметр исключает допуск [пустых значений](#пустые-значения) для данной
схемы.

```ts
const schema = {
  type: DataType.ANY,
  required: true,
}
```

#### default

Параметр определяет значение по умолчанию на случай, если входящее
значение является [пустым](#пустые-значения).

```ts
const schema = {
  type: DataType.STRING,
  default: 'John Doe',
}
```

#### validate

Пользовательская функция(и) валидации для применения дополнительных
правил. Может быть одной функцией или массивом функций.

Валидатор может сигнализировать об ошибке несколькими способами:
1. Вернуть строку с сообщением об ошибке (рекомендуется для простых случаев).
2. Вернуть `false` для генерации стандартного сообщения об ошибке.
3. Вернуть экземпляр `Error` (например, `new ValidationError(...)`).
4. Выбросить исключение.

Если валидация прошла успешно, функция должна вернуть `true` или
ничего (`undefined`).

Пример с возвратом строки:

```ts
const schema = {
  type: DataType.NUMBER,
  // Если значение не положительное, вернется строка,
  // которая станет сообщением ошибки
  validate: (value) => value > 0 || 'Значение должно быть положительным.',
}
```

Пример с `throw` (для более сложной логики):

```ts
import {DataSchema, ValidationError} from '@e22m4u/ts-data-schema';
// import {ServiceContainer} from '@e22m4u/js-service';

function nonEmptyString(
  value: unknown,
  schema: DataSchema,
  sourcePath?: string,
  // services: ServiceContainer,
) {
  if (!value || typeof value !== 'string') {
    if (sourcePath)
      throw new ValidationError(
        'Value of %v must be a non-empty String, but %v given.',
        sourcePath,
        value,
      );
    throw new ValidationError(
      'Value must be a non-empty String, but %v given.',
      value,
    );
  }
}

const schema = {
  type: DataType.STRING,
  validate: nonEmptyString,
}
```

## Пустые значения

Проверка наличия полезной нагрузки выполняется встроенным модулем
[@e22m4u/js-empty-values](https://www.npmjs.com/package/@e22m4u/js-empty-values)
(не требует установки). Согласно спецификации модуля, разные типы данных
имеют собственные наборы пустых значений. Эти наборы используются для
определения наличия полезной нагрузки при проверке обязательных
значений или определения необходимости использования значения по умолчанию.

| константа          | тип         | пустые значения           |
|--------------------|-------------|---------------------------|
| `DataType.ANY`     | `'any'`     | `undefined`, `null`       |
| `DataType.STRING`  | `'string'`  | `undefined`, `null`, `''` |
| `DataType.NUMBER`  | `'number'`  | `undefined`, `null`, `0`  |
| `DataType.BOOLEAN` | `'boolean'` | `undefined`, `null`       |
| `DataType.ARRAY`   | `'array'`   | `undefined`, `null`, `[]` |
| `DataType.OBJECT`  | `'object'`  | `undefined`, `null`, `{}` |

В первой колонке указаны константы каждого типа, которые могут быть
использованы вместо строки названия типа (вторая колонка).

## Декораторы

Декораторы предоставляют удобный способ определения схем данных
с использованием классов.

Общие декораторы:

- `@dataSchema` - базовый декоратор для определения схемы данных
- `@dsProperty` - декоратор для определения свойств схемы

Декораторы конкретных типов данных:

- `@dsAny` - для значений любого типа
- `@dsString` - для строковых значений
- `@dsNumber` - для числовых значений
- `@dsBoolean` - для логических значений
- `@dsArray` - для массивов
- `@dsObject` - для объектов

#### @dsObject

Декоратор `@dsObject` определяет класс как схему объекта. Он позволяет
генерировать объект схемы через утилиту `getDataSchemaFromClass`.

```ts
import {
  dsObject,
  dsString,
  getDataSchemaFromClass,
} from '@e22m4u/ts-data-schema';

@dsObject()
class PostSchema {
  @dsString()
  title: string;
}

const postSchema = getDataSchemaFromClass(PostSchema);
console.log(postSchema);
// {
//   type: 'object',
//   properties: {
//     "title": {
//       type: 'string'
//     }
//   }
// }
```

## Примеры

#### Проверка простых значений

```ts
import {
  DataType,
  DataValidator,
  ValidationError,
} from '@e22m4u/ts-data-schema';

const validator = new DataValidator();

// Определение схемы
const schema = {
  type: DataType.STRING,
};

// Валидация значения согласно схеме
validator.validate('John', schema); // Успех, ничего не происходит

try {
  validator.validate(10, schema); // Ошибка
} catch (e) {
  if (e instanceof ValidationError) {
    // "Value must be a String, but 10 was given."
    console.error(e.message);
  }
}
```

#### Пользовательская функция-валидатор

```ts
import {
  DataType,
  DataValidator,
  ValidationError,
} from '@e22m4u/ts-data-schema';

const validator = new DataValidator();

// Определение схемы с коротким валидатором
const schema = {
  type: DataType.STRING,
  validate: (v) => (v && v.length > 0) || 'Строка не должна быть пустой',
};

// Проверка значений
validator.validate('John', schema); // Успех

try {
  validator.validate('', schema); // Ошибка
} catch (e) {
  if (e instanceof ValidationError) {
    console.error(e.message); // "Строка не должна быть пустой"
  }
}
```

#### Конвертация значений

```ts
import {
  DataType,
  DataTypeCaster,
  TypeCastError,
} from '@e22m4u/ts-data-schema';

const typeCaster = new DataTypeCaster();

const schema = {
  type: DataType.NUMBER,
};

// Приведение типа согласно схеме
const num = typeCaster.cast('10', schema); // Вернет 10 (тип number)
console.log(typeof num); // "number"

try {
  // Выбросит ошибку TypeCastError
  typeCaster.cast('foo', schema);
} catch (e) {
  if (e instanceof TypeCastError) {
    console.error(e.message); // "Unable to cast String to Number."
  }
}


// Приведение типа с подавлением ошибок
const res1 = typeCaster.cast('10', schema, {noTypeCastError: true});  // 10
const res2 = typeCaster.cast('foo', schema, {noTypeCastError: true}); // "foo"
```

#### Значения по умолчанию

```ts
import {
  DataType,
  DefaultValuesApplier,
} from '@e22m4u/ts-data-schema';

const defaultsApplier = new DefaultValuesApplier();

const schema = {
  type: DataType.NUMBER,
  default: 10,
};

// Метод `applyDefaultValuesIfNeeded` возвращает
// значение по умолчанию, если входящее значение
// является пустым.
const res1 = defaultsApplier.applyDefaultValuesIfNeeded(5, schema); // 5
const res2 = defaultsApplier.applyDefaultValuesIfNeeded(0, schema); // 10
const res3 = defaultsApplier.applyDefaultValuesIfNeeded(undefined, schema); // 10
```

#### Заполнение объекта значениями по умолчанию

```ts
import {
  DataType,
  DefaultValuesApplier,
} from '@e22m4u/ts-data-schema';

const defaultsApplier = new DefaultValuesApplier();

const schema = {
  type: DataType.OBJECT,
  properties: {
    foo: {
      type: DataType.STRING,
      default: 'myDefaultValue',
    },
    bar: {
      type: DataType.NUMBER,
      default: 10,
    },
  },
};

// Метод возвращает новый объект (не затрагивая оригинал)
const res = defaultsApplier.applyDefaultValuesIfNeeded(
  {foo: null, baz: 'qux'},
  schema,
);
console.log(res);
// {
//   foo: 'myDefaultValue', // значение по умолчанию вместо null
//   bar: 10,               // значение по умолчанию (т.к. свойство
//                          // не было определено)
//   baz: 'qux'             // осталось без изменений
// }
```

#### Использование декораторов

```ts
import {
  dsNumber,
  dsObject,
  dsString,
  getDataSchemaFromClass,
} from '@e22m4u/ts-data-schema';

@dsObject()
class AuthorSchema {
  @dsNumber({required: true})
  id!: number;

  @dsString({validate: (name) => name.length > 0 || 'Name cannot be empty'})
  name?: string;
}

const authorSchema = getDataSchemaFromClass(AuthorSchema);
console.log(JSON.stringify(authorSchema, null, 2));
// {
//   type: 'object',
//   properties: {
//     id: {
//       type: 'number',
//       required: true
//     },
//     name: {
//       type: 'string',
//       validate: '...'
//     }
//   }
// }
```

#### Вложенные объекты с декораторами

```ts
import {
  dsNumber,
  dsObject,
  dsString,
  getDataSchemaFromClass,
} from '@e22m4u/ts-data-schema';

// AuthorSchema определена в примере выше

@dsObject()
class PostSchema {
  @dsNumber({required: true})
  id!: number;

  @dsString()
  title?: string;

  // Использование фабрики `() => AuthorSchema` для ссылки на другой класс
  @dsObject(() => AuthorSchema, {required: true})
  author!: AuthorSchema;
}

const postSchema = getDataSchemaFromClass(PostSchema);
console.log(JSON.stringify(postSchema, null, 2));
// {
//   type: 'object',
//   properties: {
//     id: {
//       type: 'number',
//       required: true
//     },
//     title: {
//       type: 'string'
//     },
//     author: {
//       type: 'object',
//       required: true,
//       properties: {
//         id: {
//           type: 'number',
//           required: true
//         },
//         name: {
//           type: 'string',
//           validate: '...'
//         }
//       }
//     }
//   }
// }
```

## Отладка

Установка переменной `DEBUG` включает вывод логов.

```bash
DEBUG=tsDataSchema* npm run test
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT