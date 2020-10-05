export type AccessorFn<T> = ((value: T) => any)
export type Accessor<T> = string | string[] | AccessorFn<T>;

export enum ValueType {
  Any = 'any',
  String = 'string',
  Number = 'number',
  Date = 'date',
}

export enum Nulls {
  /** Treat nulls as lower than any other values. This is the default setting. */
  Low = 'low',
  /** Treat nulls as higher than any other values. */
  High = 'high',
  /** Assume there are no nullish values in the data. This may cause exceptions if you are wrong. */
  None = 'none',
}

export interface SortAccessorDefinition<T> {
  /** A function that returns a value to sort on, or a string/array path into the object */
  value: Accessor<T>;
  /** True to sort descending */
  descending? : boolean;
  /** Predefine the type of data for faster sorting. Using this will likely throw an exception if the data does not match the specified type. */
  type?: ValueType;
  /** Sort null/undefined values as lower than others (default), higher than others, or assume there aren't any. */
  nulls?: Nulls;
}

export type SortAccessor<T> = SortAccessorDefinition<T> | Accessor<T>;

export type CompareFn<T> = (a: T, b: T) => number;

// This is from https://github.com/angus-c/just/blob/master/packages/object-safe-get/index.js
function get(obj, propsArg, defaultValue?) {
  if (!obj) {
    return defaultValue;
  }
  var props, prop;
  if (Array.isArray(propsArg)) {
    props = propsArg.slice(0);
  }
  if (typeof propsArg == 'string') {
    props = propsArg.split('.');
  }
  if (typeof propsArg == 'symbol') {
    props = [propsArg];
  }
  if (!Array.isArray(props)) {
    throw new Error('props arg must be an array, a string or a symbol');
  }
  while (props.length) {
    prop = props.shift();
    if (!obj) {
      return defaultValue;
    }
    obj = obj[prop];
    if (obj === undefined) {
      return defaultValue;
    }
  }
  return obj;
}

function sortStrings(a: string, b: string) {
  return a.localeCompare(b);
}

function sortNumbers(a: number, b: number) {
  return a - b;
}

function sortDates(a: Date, b: Date) {
  return a.valueOf() - b.valueOf();
}

function sortAny(a: any, b : any) {
  if(typeof a === 'number') {
    // Try number first since it will usually be a number.
    return a - b;
  } else if(typeof a === 'string') {
    return a.localeCompare(b);
  } else if(a instanceof Date) {
    return a.valueOf() - b.valueOf();
  } else {
    return a - b;
  }
}

const sortFnMap = {
  [ValueType.Date]: sortDates,
  [ValueType.Number]: sortNumbers,
  [ValueType.String]: sortStrings,
};

function nullsHigh(sortFn : CompareFn<any>)  {
  return (a, b) => {
    let aNull = a === null || a === undefined;
    let bNull = b === null || b === undefined;
    if(aNull || bNull) {
      if(aNull && bNull) {
        return 0;
      } else if(aNull) {
        return 1;
      } else if(bNull) {
        return -1;
      }
    }

    return sortFn(a, b);
  }
}

function nullsLow(sortFn : CompareFn<any>) {
  return (a, b) => {
    let aNull = a === null || a === undefined;
    let bNull = b === null || b === undefined;
    if(aNull || bNull) {
      if(aNull && bNull) {
        return 0;
      } else if(aNull) {
        return -1;
      } else if(bNull) {
        return 1;
      }
    }

    return sortFn(a, b);

  };
}

function createAccessor<T>(acc : Accessor<T>) {
  if(typeof acc === 'string' || Array.isArray(acc)) {
    return (value : T) => get(value, acc);
  }

  return acc;
}

export function sorter<T>(...accessors : SortAccessor<T>[]) : CompareFn<T> {
  let sortFns = accessors.map((acc) => {
    if(typeof acc === 'function' || typeof acc === 'string' || Array.isArray(acc)) {
      acc = {
        value: acc,
      };
    }

    let accessor = createAccessor(acc.value);
    let sortFn : CompareFn<any> = acc.type ? sortFnMap[acc.type] : sortAny;

    if(acc.nulls === Nulls.Low || acc.nulls === undefined) {
      sortFn = nullsLow(sortFn);
    } else if(acc.nulls === Nulls.High) {
      sortFn = nullsHigh(sortFn);
    }

    if(acc.descending) {
      return (a, b) => -sortFn(accessor(a), accessor(b));
    } else {
      return (a, b) => sortFn(accessor(a), accessor(b));
    }
  });

  return function sortComparator(a: T, b: T) {
    for(let fn of sortFns) {
      let cmpValue = fn(a, b);
      if(cmpValue !== 0) {
        return cmpValue;
      }
    }

    return 0;
  }
}

export default sorter;

