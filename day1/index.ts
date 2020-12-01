import { of } from "rxjs";
import { filter, map } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

type Pair<T, K> = [T, K];

const day1: ExerciseModuleFunc = async (input: string) => {
  const numbers = input.split("\n").map(line => Number(line));
  const obs = of(...numbers).pipe(
    map((number, index) => [number, numbers.slice(index)] as Pair<number, number[]>),
    map(pair => [pair[0], pair[1].find(elem => pair[0] + elem === 2020)] as Pair<number, number | undefined>),
    filter(pair => pair[1] !== undefined),
    map(pair => pair[0] * pair[1]),
    map(solution => solution.toString())
  )

  return obs.toPromise();
}

export default day1;
