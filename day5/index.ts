import { Observable, of } from "rxjs";
import { concatAll, count, filter, groupBy, map, max, mergeMap, reduce, tap } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

type Pair = [number, number];

const getColumnAndRow = (line: string): Pair => {
  const chars = line.split("");
  let lo: number, hi: number;

  lo = 0; hi = 127;
  for (let i = 0; i < 7; i += 1) {
    console.log("i:",i,"lo:",lo,"hi:",hi);

    const chr = chars[i];
    const diff = hi - lo;
    if (chr === "F") {
      hi = Math.floor(hi - diff / 2);
    }
    else if (chr === "B") {
      lo = Math.ceil(lo + diff / 2);
    }
  }

  const row = hi;

  lo = 0; hi = 7;
  for (let i = 0; i < 3; i += 1) {
    console.log("i:",i,"lo:",lo,"hi:",hi);

    const chr = chars[i + 7];
    const diff = hi - lo;
    if (chr === "L") {
      hi = Math.floor(hi - diff / 2);
    }
    else if (chr === "R") {
      lo = Math.ceil(lo + diff / 2);
    }
  }

  const col = hi;
  return [col, row];
}

const calcID = (pair: Pair) => pair[1] * 8 + pair[0];

const day5: ExerciseModuleFunc = async (input: string) => {
  const prom1 = of(input).pipe(
    map(l => l.split("\n")),
    concatAll(),
    map(getColumnAndRow),
    map(calcID),
    max()
  ).toPromise();

  return Promise.all([prom1]);
}

export default day5;
