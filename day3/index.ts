import { Observable, of } from "rxjs";
import { concatAll, count, filter, map, take, tap } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

type Coords = [number, number];

const day3: ExerciseModuleFunc = async (input: string) => {
  const lines = input.split("\n");
  const my = lines.length;
  const mx = lines[0].length;

  const isTree = (x: number, y: number): boolean => lines[y][x % mx] === "#";

  const indexObs = new Observable<Coords>(sub => {
    for (let y = 0, x = 0; y < my; y += 1, x += 3) {
      if (isTree(x, y)) {
        sub.next([x, y]);
      }
    }
    sub.complete();
  })

  const prom1 = indexObs.pipe(
    tap(console.log),
    count()
  ).toPromise();

  return Promise.all([prom1]);
}

export default day3;
