'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var get = _interopDefault(require('just-safe-get'));

(function (ValueType) {
    ValueType["Any"] = "any";
    ValueType["String"] = "string";
    ValueType["Number"] = "number";
    ValueType["Date"] = "date";
})(exports.ValueType || (exports.ValueType = {}));
(function (Nulls) {
    /** Treat nulls as lower than any other values. This is the default setting. */
    Nulls["Low"] = "low";
    /** Treat nulls as higher than any other values. */
    Nulls["High"] = "high";
    /** Assume there are no nullish values in the data. This may cause exceptions if you are wrong. */
    Nulls["None"] = "none";
})(exports.Nulls || (exports.Nulls = {}));
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
    if (typeof a === 'number') {
        // Try number first since it will usually be a number.
        return a - b;
    }
    else if (typeof a === 'string') {
        return a.localeCompare(b);
    }
    else if (a instanceof Date) {
        return a.valueOf() - b.valueOf();
    }
    else {
        return a - b;
    }
}
const sortFnMap = {
    [exports.ValueType.Date]: sortDates,
    [exports.ValueType.Number]: sortNumbers,
    [exports.ValueType.String]: sortStrings,
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
        if (acc.nulls === exports.Nulls.Low || acc.nulls === undefined) {
            sortFn = nullsLow(sortFn);
        }
        else if (acc.nulls === exports.Nulls.High) {
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

exports.default = sorter;
exports.sorter = sorter;
//# sourceMappingURL=index.js.map
