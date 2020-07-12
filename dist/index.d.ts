export declare type AccessorFn<T> = ((value: T) => any);
export declare type Accessor<T> = string | string[] | AccessorFn<T>;
export declare enum ValueType {
    Any = 0,
    String = 1,
    Number = 2,
    Date = 3
}
export declare enum NullBehavior {
    /** Treat nulls as lower than any other values. This is the default setting. */
    Low = 0,
    /** Treat nulls as higher than any other values. */
    High = 1,
    /** Assume there are no nullish values in the data. This may cause exceptions if you are wrong. */
    AssumeNone = 2
}
export interface SortAccessorDefinition<T> {
    /** A function that returns a value to sort on, or a string/array path into the object */
    value: Accessor<T>;
    /** True to sort descending */
    descending?: boolean;
    /** Predefine the type of data for faster sorting. Using this will likely throw an exception if the data does not match the specified type. */
    type?: ValueType;
    /** Sort null/undefined values as lower than others (default), higher than others, or assume there aren't any. */
    nulls?: NullBehavior;
}
export declare type SortAccessor<T> = SortAccessorDefinition<T> | Accessor<T>;
export declare type CompareFn<T> = (a: T, b: T) => number;
export declare function sorter<T>(...accessors: SortAccessor<T>[]): (a: any, b: any) => number;
