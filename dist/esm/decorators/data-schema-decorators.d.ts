import { Flatten } from '../types.js';
import { Prototype } from '../types.js';
import { Constructor } from '../types.js';
import { DataType } from '../data-schema.js';
import { DataSchemaMetadata } from './data-schema-metadata.js';
import { DataSchemaClassFactory } from './data-schema-metadata.js';
/**
 * Decorators list:
 *
 *   @dataSchema; - applies to class and instance property
 *   @dsProperty; - applies to instance property
 *
 * Decorator aliases:
 *
 *   @dsAny;      - applies to instance property
 *   @dsString;   - applies to instance property
 *   @dsNumber;   - applies to instance property
 *   @dsBoolean;  - applies to instance property
 *   @dsArray;    - applies to instance property
 *   @dsObject;   - applies to class and instance property
 */
/**
 * Decorator property target error message.
 */
export declare const DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE = "@%s decorator is only supported on an instance property.";
/**
 * Decorator class or property target error message.
 */
export declare const DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE = "@%s decorator is only supported on a class or an instance property.";
/**
 * Redundant type option error message.
 */
export declare const REDUNDANT_TYPE_OPTION_ERROR_MESSAGE = "The option \"type\" is not supported in the @%s decorator.";
/**
 * Data schema decorator.
 * (for class and instance property)
 *
 * @param schema
 */
export declare function dataSchema<T extends object>(schema: DataSchemaMetadata): (target: Constructor<T> | Prototype<T>, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
/**
 * Data schema property decorator.
 * (for instance property only)
 *
 * @param schema
 */
export declare function dsProperty<T extends object>(schema: DataSchemaMetadata): (target: Prototype<T>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Data schema without type.
 */
export type DataSchemaMetadataWithoutType = Flatten<Omit<DataSchemaMetadata, 'type'>>;
/**
 * Data schema decorator of Any type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsAny()
 *   @dsAny({required: true})
 * ```
 */
export declare const dsAny: (schema?: DataSchemaMetadataWithoutType) => <T extends object>(target: Prototype<T>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Data schema decorator of String type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsString()
 *   @dsString({required: true})
 * ```
 */
export declare const dsString: (schema?: DataSchemaMetadataWithoutType) => <T extends object>(target: Prototype<T>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Data schema decorator of Number type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsNumber()
 *   @dsNumber({required: true})
 * ```
 */
export declare const dsNumber: (schema?: DataSchemaMetadataWithoutType) => <T extends object>(target: Prototype<T>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Data schema decorator of Boolean type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsBoolean()
 *   @dsBoolean({required: true})
 * ```
 */
export declare const dsBoolean: (schema?: DataSchemaMetadataWithoutType) => <T extends object>(target: Prototype<T>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Data schema decorator of Array type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsArray()
 *   @dsArray({required: true})
 *
 *   @dsArray(DataType.STRING);
 *   @dsArray(DataType.STRING, {required: true});
 *
 *   @dsArray({type: DataType.STRING});
 *   @dsArray({type: DataType.STRING}, {required: true});
 * ```
 *
 * @param schemaOrItemType
 * @param schema
 */
export declare const dsArray: (schemaOrItemType?: DataSchemaMetadataWithoutType | DataSchemaMetadata | DataType, schema?: DataSchemaMetadataWithoutType) => <T extends object>(target: Prototype<T>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Data schema decorator of Object type.
 * (for class and instance property)
 * Examples:
 * ```ts
 *   @dsObject()
 *   @dsObject({required: true})
 * ```
 *
 * @param schemaOrClassFactory
 * @param schema
 */
export declare function dsObject(schemaOrClassFactory?: DataSchemaMetadataWithoutType | DataSchemaClassFactory, schema?: DataSchemaMetadataWithoutType): <T extends object>(target: Constructor<T> | Prototype<T>, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
