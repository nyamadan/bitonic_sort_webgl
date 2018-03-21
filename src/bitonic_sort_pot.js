import {swap} from './array_util.js'

const SORT_COMPARE = Symbol('SortCompare');
const SORT_BEFORE = Symbol('SortBegin');
const SORT_AFTER = Symbol('SortAfter');
const SORT_BEGIN = Symbol('SortBefore');
const SORT_END = Symbol('SortEnd');

export {SORT_COMPARE, SORT_BEFORE, SORT_AFTER, SORT_BEGIN, SORT_END}

export function *bitonicSortPOT(ary) {
  for(let cnt = 0; true; cnt++) {
    let step = cnt;
    let rank = 0;
    for(; rank < step; rank++) {
      step -= rank + 1;
    }

    let stepno = 1 << (rank + 1);
    let offset = 1 << (rank - step);
    let stage = 2 * offset;

    if(stepno > ary.length) {
      break;
    }

    let length = ary.length - offset;

    yield [SORT_BEGIN, null, null, ary, stepno, offset, stage];

    for(var i = 0; i < length; i++) {
      if((i % stage) >= offset){
        continue;
      }

      let j = i + offset;

      yield [SORT_COMPARE, i, j, ary, stepno, offset, stage];
      if((Math.floor(i / stepno) % 2) <= 0.5) {
        if(ary[i] > ary[j]) {
          yield [SORT_BEFORE, i, j, ary, stepno, offset, stage];
          swap(ary, i, j);
          yield [SORT_AFTER, i, j, ary, stepno, offset, stage];
        }
      } else {
        if(ary[i] < ary[j]) {
          yield [SORT_BEFORE, i, j, ary, stepno, offset, stage];
          swap(ary, i, j);
          yield [SORT_AFTER, i, j, ary, stepno, offset, stage];
        }
      }
    }

    yield [SORT_END, null, null, ary, stepno, offset, stage];
  }
}

