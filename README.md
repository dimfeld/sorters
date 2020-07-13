Sorters is a compact package for generating Javascript array `sort` comparators that handle things like null values, descending sort, and multi-level comparisons.

# Usage

```js
import { sorter } from 'sorters';

let data = [
  { a: 5, b: 'strb', c: new Date('2017-01-01') },
  { a: 2, b: 'stra', c: new Date('2018-01-01') },
  { a: null, b: null },
  { a: 2, b: 'strc', c: new Date('2018-01-01') },
];

data.sort(sorter(
    { value: 'c', nulls: NullBehavior.High },
    'a',
    { value: (val) => val.b, descending: true, type: ValueType.String }
  ));
```

## Arguments

Each argument to the `sorter` function is an object that represents how to perform a single level of the sort.

If two items in the array are equal for a particular level, then the next level is tried, and so on until a difference is found or all levels have equal values.

The object contains four properties:

### value

`value` specifies which field to access in each item. It can be a function, a string specifying a path, or an array specifying a path.

When `value` is the only argument required, it can also be passed directly as the argument instead of wrapping it with an object, as in the `'a'` argument in the example above.

### descending

`descending` is an optional boolean indicating that the sort should be done in descending order. If omitted, the sort is done in ascending order.

### type

`type` gives the sorter a hint as the to type of data it will encounter. Typescript users can use the `ValueType` enum, and others can use the values `string`, `number`, and `date`.

If some of the data does not match the specified type, you will likely encounter incorrect results or an error.

The default value is `any`, which will detect the type of value as it is sorted and act appropriately.

```typescript
export enum ValueType {
  Any = 'any',
  String = 'string',
  Number = 'number',
  Date = 'date',
}
```

### nulls

How to treat null or undefined values in the data. Typescript users can use the `Nulls` enum, while others can use the values `low`, `high`, and `none`.

```typescript
export enum Nulls {
  /** Treat nulls as lower than any other values. This is the default setting. */
  Low = 'low',
  /** Treat nulls as higher than any other values. */
  High = 'high',
  /** Assume there are no nullish values in the data. This may cause exceptions if you are wrong. */
  None = 'none',
}
```

Using `Nulls.None` in data that contains nullish values will probably cause an error.

