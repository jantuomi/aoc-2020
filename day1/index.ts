import { of } from "rxjs";
import { concatAll, filter, map } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

type Pair<T, K> = [T, K];
type Triple<A, B, C> = [A, B, C];

const allTriples = <T extends unknown>(lst: T[]): Triple<T, T, T>[] => {
  const results: Triple<T, T, T>[] = [];
  lst.forEach((a, ai) => {
    lst.slice(ai + 1).forEach((b, bi) => {
      lst.slice(bi + 1).forEach((c, _ci) => {
        results.push([a, b, c]);
      })
    })
  });
  return results;
}

const day1: ExerciseModuleFunc = async (input: string) => {
  const numbers = input.split("\n").map(line => Number(line));
  const obs1 = of(...numbers).pipe(
    map((number, index) => [number, numbers.slice(index + 1)] as Pair<number, number[]>),
    map(pair => [pair[0], pair[1].find(elem => pair[0] + elem === 2020)] as Pair<number, number | undefined>),
    filter(pair => pair[1] !== undefined),
    map(pair => pair[0] * pair[1]),
    map(solution => solution.toString())
  )

  const first = await obs1.toPromise();

  const obs2 = of(numbers).pipe(
    map(allTriples),
    concatAll(),
    filter(t => t[0] + t[1] + t[2] === 2020),
    map(t => t[0] * t[1] * t[2]),
    map(sol => sol.toString())
  );

  const second = await obs2.toPromise();

  return [first, second];
}

export default day1;
