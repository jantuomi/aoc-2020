import { Observable, of } from "rxjs";
import { concatAll, count, filter, groupBy, map, max, mergeMap, reduce, scan, tap, toArray } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

type Pair = [number, number];

const getColumnAndRow = (line: string): Pair => {
  const chars = line.split("");
  let lo: number, hi: number;

  lo = 0; hi = 127;
  for (let i = 0; i < 7; i += 1) {
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

const findVacantSeats = (lst: Pair[]): Pair[] => {
  const seatMap: boolean[][] = Array(128);
  for (let i = 0; i < 127; i += 1) {
    seatMap[i] = Array(8);
    for (let j = 0; j < 7; j += 1) {
      seatMap[i][j] = true;
    }
  }

  for (let seat of lst) {
    seatMap[seat[1]][seat[0]] = false;
  }

  const vacants: Pair[] = [];
  for (let row = 0; row < 127; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      if (seatMap[row][col] === true) {
        vacants.push([col, row]);
      }
    }
  }

  return vacants;
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

  const prom2 = of(input).pipe(
    map(l => l.split("\n")),
    concatAll(),
    map(getColumnAndRow),
    toArray(),
    map(findVacantSeats),
    concatAll(),
    map(calcID),
    toArray()
  ).toPromise();

  return Promise.all([prom1, prom2]);
}

export default day5;
