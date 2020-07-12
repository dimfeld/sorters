import get from 'just-safe-get';

var ValueType;
(function (ValueType) {
    ValueType[ValueType["Any"] = 0] = "Any";
    ValueType[ValueType["String"] = 1] = "String";
    ValueType[ValueType["Number"] = 2] = "Number";
    ValueType[ValueType["Date"] = 3] = "Date";
})(ValueType || (ValueType = {}));
var NullBehavior;
(function (NullBehavior) {
    /** Treat nulls as lower than any other values. This is the default setting. */
    NullBehavior[NullBehavior["Low"] = 0] = "Low";
    /** Treat nulls as higher than any other values. */
    NullBehavior[NullBehavior["High"] = 1] = "High";
    /** Assume there are no nullish values in the data. This may cause exceptions if you are wrong. */
    NullBehavior[NullBehavior["AssumeNone"] = 2] = "AssumeNone";
})(NullBehavior || (NullBehavior = {}));
function sortStrings(a, b) {
    return a.localeCompare(b);
}
function sortNumbers(a, b) {
    return a - b;
}
function sortDates(a, b) {
    return a.valueOf() - b.valueOf();
}
function sortAny(a, b) {
    if (typeof a === 'string') {
        return sortStrings(a, b);
    }
    else if (a instanceof Date) {
        return sortDates(a, b);
    }
    else {
        return sortNumbers(a, b);
    }
}
const sortFnMap = {
    [ValueType.Date]: sortDates,
    [ValueType.Number]: sortNumbers,
    [ValueType.String]: sortStrings,
};
function nullsHigh(sortFn) {
    return (a, b) => {
        let aNull = a === null || a === undefined;
        let bNull = b === null || b === undefined;
        if (aNull || bNull) {
            if (aNull && bNull) {
                return 0;
            }
            else if (aNull) {
                return 1;
            }
            else if (bNull) {
                return -1;
            }
        }
        return sortFn(a, b);
    };
}
function nullsLow(sortFn) {
    return (a, b) => {
        let aNull = a === null || a === undefined;
        let bNull = b === null || b === undefined;
        if (aNull || bNull) {
            if (aNull && bNull) {
                return 0;
            }
            else if (aNull) {
                return -1;
            }
            else if (bNull) {
                return 1;
            }
        }
        return sortFn(a, b);
    };
}
function createAccessor(acc) {
    if (typeof acc === 'string' || Array.isArray(acc)) {
        return (value) => get(value, acc);
    }
    return acc;
}
function sorter(...accessors) {
    let sortFns = accessors.map((acc) => {
        if (typeof acc === 'function' || typeof acc === 'string' || Array.isArray(acc)) {
            acc = {
                value: acc,
            };
        }
        let accessor = createAccessor(acc.value);
        let sortFn = acc.type ? sortFnMap[acc.type] : sortAny;
        if (acc.nulls === NullBehavior.Low || acc.nulls === undefined) {
            sortFn = nullsLow(sortFn);
        }
        else if (acc.nulls === NullBehavior.High) {
            sortFn = nullsHigh(sortFn);
        }
        if (acc.descending) {
            return (a, b) => -sortFn(accessor(a), accessor(b));
        }
        else {
            return (a, b) => sortFn(accessor(a), accessor(b));
        }
    });
    return function sortComparator(a, b) {
        for (let fn of sortFns) {
            let cmpValue = fn(a, b);
            if (cmpValue !== 0) {
                return cmpValue;
            }
        }
        return 0;
    };
}

export { NullBehavior, ValueType, sorter };
//# sourceMappingURL=index.mjs.map
