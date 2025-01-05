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
validator.validate('string', schema); // вернет undefined
validator.validate(10, schema);       // ошибка ValidationError
```

Приведение типов.

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

Использование декораторов для построения схемы.

```ts
import {dsNumber} from '@e22m4u/ts-data-schema';
import {dsObject} from '@e22m4u/ts-data-schema';
import {dsString} from '@e22m4u/ts-data-schema';
import {DataSchema} from '@e22m4u/ts-data-schema';
import {ClassToPlain} from '@e22m4u/ts-data-schema';
import {getDataSchemaFromClass} from '@e22m4u/ts-data-schema';

@dsObject()
class Author {
  @dsNumber({required: true})
  id: number;

  @dsString()
  name?: string;
}

@dsObject()
class Post {
  @dsNumber({required: true})
  id: number;

  @dsString({validate: myAmazingValidator})
  title?: string;

  @dsObject(() => Author, {required: true})
  author?: ClassToPlain<Author>;
}

const postDataSchema = getDataSchemaFromClass(Post);
console.log(postDataSchema);
// {
//   type: "object"
//   properties: {
//     id: {
//       type: "number",
//       required: true,
//     },
//     title: {
//       type: "string",
//       validate: myAmazingValidator() {...}
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

Общие:

- `@dataSchema`
- `@dsProperty`

Псевдонимы:

- `@dsAny`
- `@dsString`
- `@dsNumber`
- `@dsBoolean`
- `@dsArray`
- `@dsObject`

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
