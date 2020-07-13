import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { sorter, Nulls, ValueType } from './index';

function generateData(withNulls = true) : { a: number; b:string; c: Date}[] {
  return [
    { a: 5, b: 'strb', c: new Date('2017-01-01') },
    { a: 2, b: 'stra', c: new Date('2018-01-01') },
    withNulls ? { a: null, b: null } : null,
    { a: 2, b: 'strc', c: new Date('2018-01-01') },
  ].filter(Boolean) as { a: number; b:string; c: Date}[];
}

test('single field sort', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter((val) => val.a));
  let expected = data.slice().sort((a, b) => a.a - b.a);

  assert.equal(sorted, expected);
});

test('number sort with explicit type', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter({ value: (val) => val.a, type: ValueType.Number }));
  let expected = data.slice().sort((a, b) => a.a - b.a);

  assert.equal(sorted, expected);
});

test('string accessor', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter('a'));
  let expected = data.slice().sort((a, b) => a.a - b.a);

  assert.equal(sorted, expected);
});

test('string sort', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter('b'));
  let expected = data.slice().sort((a, b) => {
    if(!a.b) {
      return -1;
    } else if(!b.b) {
      return 1;
    }
    return a.b.localeCompare(b.b);
  });
  assert.equal(sorted, expected);
});

test('string sort with explicit type', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter({ value: 'b', type: ValueType.String }));
  let expected = data.slice().sort((a, b) => {
    if(!a.b) {
      return -1;
    } else if(!b.b) {
      return 1;
    }
    return a.b.localeCompare(b.b);
  });
  assert.equal(sorted, expected);
});

test('date sort', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter('c'));
  let expected = data.slice().sort((a, b) => {
    if(!a.c) {
      return -1;
    } else if(!b.c) {
      return 1;
    }
    return a.c.valueOf() - b.c.valueOf();
  });
  assert.equal(sorted, expected);
});

test('date sort with explciit type', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter({ value: 'c', type: ValueType.Date }));
  let expected = data.slice().sort((a, b) => {
    if(!a.c) {
      return -1;
    } else if(!b.c) {
      return 1;
    }
    return a.c.valueOf() - b.c.valueOf();
  });
  assert.equal(sorted, expected);
});


test('descending sort', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter({ value: 'b', descending: true }));
  let expected = data.slice().sort((a, b) => {
    if(!a.b) {
      return 1;
    } else if(!b.b) {
      return -1;
    }
    return b.b.localeCompare(a.b);
  });
  assert.equal(sorted, expected);
});

test('nulls as high values', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter({ value: 'b', nulls: Nulls.High }));
  let expected = data.slice().sort((a, b) => {
    if(!a.b) {
      return 1;
    } else if(!b.b) {
      return -1;
    }
    return a.b.localeCompare(b.b);
  });
  assert.equal(sorted, expected);
});

test('assume no nulls', () => {
  let data = generateData(false);
  let sorted = data.slice().sort(sorter({ value: 'b', nulls: Nulls.AssumeNone }));
  let expected = data.slice().sort((a, b) => {
    return a.b.localeCompare(b.b);
  });
  assert.equal(sorted, expected);
});

test('descending sort with nulls as high values', () => {
  let data = generateData();
  let sorted = data.slice().sort(sorter({ value: 'b', descending: true, nulls: Nulls.High }));
  let expected = data.slice().sort((a, b) => {
    if(!a.b) {
      return -1;
    } else if(!b.b) {
      return 1;
    }
    return b.b.localeCompare(a.b);
  });
  assert.equal(sorted, expected);
});

test('multiple sort functions where last breaks tie', () => {
  let data = generateData();
  let sorted = data.sort(sorter('c', 'a', { value: 'b', descending: true }));
  let expected = [
    { a: null, b: null },
    { a: 5, b: 'strb', c: new Date('2017-01-01') },
    { a: 2, b: 'strc', c: new Date('2018-01-01') },
    { a: 2, b: 'stra', c: new Date('2018-01-01') },
  ];

  assert.equal(sorted, expected);
});

test('multiple sort functions with no ties', () => {
  let data = generateData();
  let sorted = data.sort(sorter({ value: 'b', nulls: Nulls.High }, 'a', 'c'));
  let expected = [
    { a: 2, b: 'stra', c: new Date('2018-01-01') },
    { a: 5, b: 'strb', c: new Date('2017-01-01') },
    { a: 2, b: 'strc', c: new Date('2018-01-01') },
    { a: null, b: null },
  ];

  assert.equal(sorted, expected);
});

test.run();
