# @e22m4u/ts-data-schema

Валидация данных и приведение типов для TypeScript.

## Содержание

- [Ключевые особенности](#ключевые-особенности)
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

## Ключевые особенности
- **DataValidator** - Сервис валидации со встроенной проверкой типов.
- **DataTypeCaster** - Сервис конвертации значений согласно схеме данных.
- **DefaultValuesApplier** - Сервис заполняющий данные значениями по-умолчанию.
- Расширяемая архитектура, позволяющая добавлять пользовательские валидаторы и преобразователи типов.
- Подробная отладка.

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

Определяет тип значения с помощью констант указанных ниже.

- `DataType.ANY` - принимает любой тип
- `DataType.STRING` - строковые значения
- `DataType.NUMBER` - числовые значения
- `DataType.BOOLEAN` - логические значения
- `DataType.ARRAY` - массивы
- `DataType.OBJECT` - объекты (не экземпляры)

```ts
import {DataType} from '@e22m4u/ts-data-schema';

const schema = {
  type: DataSchema.STRING,
}
```

#### items

Используется массивами для определения схемы элементов. Это вложенный
объект `DataSchema`, описывающий каждый элемент массива.

```ts
const schema = {
  type: DataSchema.ARRAY,
  items: {type: DataSchema.STRING},
}
```

#### properties

Используется объектами для определения схемы свойств. Каждое свойство
представляет собой пару ключ-значение, где значением является вложенный
объект `DataSchema`.

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

Параметр исключает допуск [пустых значений](#пустые-значения) для данной схемы.

```ts
const schema = {
  type: DataSchema.ANY,
  required: true,
}
```

#### default

Параметр определяет значение по умолчанию на случай, если входящее значение
является [пустым](#пустые-значения).

```ts
const schema = {
  type: DataSchema.STRING,
  default: 'John Doe',
}
```

#### validate

Пользовательская функция(и) валидации для применения дополнительных
правил. Может быть одной функцией или массивом функций.

```ts
const schema = {
  type: DataSchema.ANY,
  validate: (value: unknown) => {
    if (typeof value !== 'string')
      throw new Error('A string required.');
  },
}
```

Использование нескольких валидаторов.

```ts
const schema = {
  type: DataSchema.ANY,
  validate: [
    myValidator1,
    myValidator2,
  ],
}
```

Использование аргументов валидатора.

```ts
import {DataSchema} from '@e22m4u/ts-data-schema';
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
```

## Пустые значения

Проверка наличия полезной нагрузки выполняется встроенным модулем
[@e22m4u/js-empty-values](https://www.npmjs.com/package/@e22m4u/js-empty-values)
(не требует установки). Согласно спецификации модуля, разные типы данных
имеют собственные наборы пустых значений. Эти наборы используются для определения
наличия полезной нагрузки при проверке обязательных значений или определения
необходимости использования значения по умолчанию.

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
import {dsObject} from '@e22m4u/ts-data-schema';
import {getDataSchemaFromClass} from '@e22m4u/ts-data-schema';

@dsObject()
class PostSchema {
  // ...
}

const postSchema = getDataSchemaFromClass(PostSchema);
console.log(postSchema);
// {
//   "type": "object",
//   "properties": { ... }
// }
```

## Примеры

Проверка простых значений.

```ts
import {DataType} from '@e22m4u/ts-data-schema';
import {DataValidator} from '@e22m4u/ts-data-schema';

const validator = new DataValidator();

// определение схемы
const schema = {
  type: DataType.STRING,
  // дополнительные опции
};

// валидация значения согласно схеме
validator.validate('John', schema); // вернет undefined
validator.validate(10, schema);     // ошибка ValidationError
```

Пользовательская функция-валидатор.

```ts
import {DataType} from '@e22m4u/ts-data-schema';
import {DataValidator} from '@e22m4u/ts-data-schema';
import {ValidationError} from '@e22m4u/ts-data-schema';

const validator = new DataValidator();

// определение функции-валидатора
function nonEmptyString(value) {
  if (!value || typeof value !== 'string')
    throw new ValidationError('Non-empty string required.');
}

// определение схемы
const schema = {
  type: DataType.STRING,
  validate: nonEmptyString, // установка вашего валидатора
  // validate: [myValidator1, myValidator2, ...],
};

// проверка значений
validator.validate('John', schema); // вернет undefined
validator.validate('', schema);     // ошибка ValidationError
```

Конвертация значений согласно схеме.

```ts
import {DataType} from '@e22m4u/ts-data-schema';
import {DataTypeCaster} from '@e22m4u/ts-data-schema';

const typeCaster = new DataTypeCaster();

// определение схемы
const schema = {
  type: DataType.NUMBER,
  // дополнительные опции
};

// приведение типа согласно схеме,
// или выброс ошибки TypeCastError
typeCaster.cast('10', schema);  // вернет 10 как number
typeCaster.cast('foo', schema); // ошибка TypeCastError

// приведение типа согласно схеме,
// или возврат значения без изменений
typeCaster.cast('10', schema, {noTypeCastError: true});  // вернет 10
typeCaster.cast('foo', schema, {noTypeCastError: true}); // вернет "foo"
```

Получить значение по умолчанию согласно указанной схеме, если входящее
значение является [пустым](#пустые-значения). В противном случае возвращается
оригинал без изменений.

```ts
import {DataType} from '@e22m4u/ts-data-schema';
import {DefaultValuesApplier} from './default-values-applier';

const defaultsApplier = new DefaultValuesApplier();

// определение схемы
// числового значения
const schema = {
  type: DataType.NUMBER,
  default: 10, // <- по умолчанию
};

// метод `applyDefaultValuesIfNeeded` возвращает
// значение по умолчанию, если входящее значение
// является пустым
const res1 = defaultsApplier.applyDefaultValuesIfNeeded(5, schema);
const res2 = defaultsApplier.applyDefaultValuesIfNeeded(0, schema);
const res3 = defaultsApplier.applyDefaultValuesIfNeeded(undefined, schema);
console.log(res1); // 5  (без изменений)
console.log(res2); // 10 (по умолчанию вместо 0)
console.log(res3); // 10 (по умолчанию вместо undefined)
```

Заполнение свойств объекта значениями по умолчанию согласно указанной
схеме (если свойство имеет [пустое значение](#пустые-значения)).

```ts
import {DataType} from '@e22m4u/ts-data-schema';
import {DefaultValuesApplier} from './default-values-applier';

const defaultsApplier = new DefaultValuesApplier();

// определене схемы объекта и значений
// по умолчанию для каждого свойства
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

// метод `applyDefaultValuesIfNeeded` по необходимости
// устанавливает стандартные значения для каждого свойства,
// и возвращает новый объект (не затрагивая оригинал)
const res = defaultsApplier.applyDefaultValuesIfNeeded(
  {foo: null, baz: 'qux'},
  schema,
);
console.log(res);
// {
//   foo: 'myDefaultValue', <- значение по умолчанию вместо null
//   bar: 10,               <- значение по умолчанию (св-во не определено)
//   baz: 'qux'             <- осталось без изменений (новое свойство)
// }
```

Использование декораторов для построения схемы объекта.

```ts
import {dsNumber} from '@e22m4u/ts-data-schema';
import {dsObject} from '@e22m4u/ts-data-schema';
import {dsString} from '@e22m4u/ts-data-schema';
import {ClassToPlain} from '@e22m4u/ts-data-schema';
import {getDataSchemaFromClass} from '@e22m4u/ts-data-schema';

@dsObject()
class AuthorSchema {
  @dsNumber({required: true})
  id!: number;

  @dsString({validate: nonEmptyString})
  name?: string;
}

type Author = ClassToPlain<AuthorSchema>;
// {
//   id: string,
//   name?: string | undefined,
// }

const authorSchema = getDataSchemaFromClass(AuthorSchema);
console.log(authorSchema);
// {
//   type: "object",
//   properties: {
//     id: {
//       type: "number",
//       required: true,
//     },
//     name: {
//       type: "string",
//       validate() {...}
//     },
//   },
// }
```

Построение схемы вложенных объектов с помощью декораторов.

```ts
import {dsNumber} from '@e22m4u/ts-data-schema';
import {dsObject} from '@e22m4u/ts-data-schema';
import {dsString} from '@e22m4u/ts-data-schema';
import {ClassToPlain} from '@e22m4u/ts-data-schema';
import {getDataSchemaFromClass} from '@e22m4u/ts-data-schema';

@dsObject()
class PostSchema {
  @dsNumber({required: true})
  id!: number;

  @dsString({validate: nonEmptyString})
  title?: string;

  @dsObject(() => AuthorSchema, {required: true})
  author!: Author;
  // AuthorSchema и Author
  // определены в примере выше
}

type Post = ClassToPlain<PostSchema>;
// {
//   id: string,
//   title?: string | undefined,
//   author: {
//     id: string,
//     name?: string | undefined,
//   }
// }

const postSchema = getDataSchemaFromClass(PostSchema);
console.log(postSchema);
// {
//   type: "object"
//   properties: {
//     id: {
//       type: "number",
//       required: true,
//     },
//     title: {
//       type: "string",
//       validate() {...},
//     },
//     author: {
//       type: "object",
//       required: true,
//       properties: {
//         id: {
//           type: "number",
//           required: true,
//         },
//         name: {
//           type: "string",
//           validate() {...},
//         },
//       },
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
