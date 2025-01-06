# @e22m4u/ts-data-schema

*[English](./README.md) | Русский*

Валидация данных и приведение типов для TypeScript.

## Ключевые особенности
- **DataValidator** - Сервис валидации со встроенной проверкой типов.
- **DataTypeCaster** - Сервис конвертации значений согласно схеме данных.
- Расширяемая архитектура, позволяющая добавлять пользовательские валидаторы и преобразователи типов.
- Подробная отладка.

## Использование

Валидация данных.

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

Использование пользовательского валидатора.

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

## DataSchema

`DataSchema` является объектом, определяющим структуру для валидации
данных и приведения типов. Схема предоставляет гибкий способ описания
формы и ограничений ваших данных. Рассмотрим определение объекта схемы.

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

Используется массивами для определения схемы их элементов. Это вложенный
объект `DataSchema`, описывающий каждый элемент массива.

```ts
const schema = {
  type: DataSchema.ARRAY,
  items: {type: DataSchema.STRING},
}
```

#### properties

Используется объектами для определения схемы их свойств. Каждое свойство
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

Указывает, является ли значение обязательным. Когда `true`, значение
не может быть `undefined` или `null`.

```ts
const schema = {
  type: DataSchema.ANY,
  required: true,
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

Пример использования аргументов валидатора.

```ts
import {DataSchema} from '@e22m4u/ts-data-schema';

function noEmptyString(
  value: unknown,
  schema: DataSchema,
  sourcePath?: string,
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

## Декораторы

Декораторы предоставляют удобный способ определения схем данных
с использованием классов TypeScript. Они позволяют создавать
типобезопасные схемы валидации и преобразования данных непосредственно
в коде.

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
генерировать структуру через утилиту `getDataSchemaFromClass`. В сочетании
с декораторами свойств, `@dsObject` формирует систему описания и валидации
данных, что особенно важно для сложных объектных структур с вложенными типами.

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
