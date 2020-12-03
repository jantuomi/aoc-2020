import { Observable, of } from "rxjs";
import { concatAll, count, filter, groupBy, map, mergeMap, reduce, take, tap } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

type Coords = [number, number];

const SLOPES: Coords[] = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
];

interface Observation {
  slope: Coords;
  coords: Coords;
}

const day3: ExerciseModuleFunc = async (input: string) => {
  const lines = input.split("\n");
  const my = lines.length;
  const mx = lines[0].length;

  const isTree = (x: number, y: number): boolean => lines[y][x % mx] === "#";

  const indexObs = new Observable<Observation>(sub => {
    for (const slope of SLOPES) {
      for (let y = 0, x = 0; y < my; y += slope[1], x += slope[0]) {
        if (isTree(x, y)) {
          sub.next({ slope, coords: [x, y] });
        }
      }
    }

    sub.complete();
  })

  const prom1 = indexObs.pipe(
    groupBy(obs => obs.slope),
    mergeMap((grp$) => grp$.pipe(count())),
    tap(console.log),
    reduce((acc, val) => acc * val)
  ).toPromise();

  return Promise.all([prom1]);
}

export default day3;
