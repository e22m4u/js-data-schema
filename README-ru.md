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

// определите схему
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

// определите схему
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

Определяет тип данных с помощью констант указанных ниже.

- `DataType.ANY` - принимает любой тип
- `DataType.STRING` - строковые значения
- `DataType.NUMBER` - числовые значения
- `DataType.BOOLEAN` - логические значения
- `DataType.ARRAY` - массивы
- `DataType.OBJECT` - объекты

```ts
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
