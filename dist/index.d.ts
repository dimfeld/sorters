export declare type AccessorFn<T> = ((value: T) => any);
export declare type Accessor<T> = string | string[] | AccessorFn<T>;
export declare enum ValueType {
    Any = "any",
    String = "string",
    Number = "number",
    Date = "date"
}
export declare enum Nulls {
    /** Treat nulls as lower than any other values. This is the default setting. */
    Low = "low",
    /** Treat nulls as higher than any other values. */
    High = "high",
    /** Assume there are no nullish values in the data. This may cause exceptions if you are wrong. */
    None = "none"
}
export interface SortAccessorDefinition<T> {
    /** A function that returns a value to sort on, or a string/array path into the object */
    value: Accessor<T>;
    /** True to sort descending */
    descending?: boolean;
    /** Predefine the type of data for faster sorting. Using this will likely throw an exception if the data does not match the specified type. */
    type?: ValueType;
    /** Sort null/undefined values as lower than others (default), higher than others, or assume there aren't any. */
    nulls?: Nulls;
}
export declare type SortAccessor<T> = SortAccessorDefinition<T> | Accessor<T>;
export declare type CompareFn<T> = (a: T, b: T) => number;
export declare function sorter<T>(...accessors: SortAccessor<T>[]): (a: any, b: any) => number;
export default sorter;
