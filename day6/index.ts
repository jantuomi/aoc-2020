import { of } from "rxjs";
import { concatAll, map, reduce } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

type Group = string[];

const intersection = <T extends unknown>(a: Set<T>, b: Set<T>) =>
  new Set(Array.from(a).filter(x => b.has(x)));

const getUniq = (group: Group): Set<string> => {
  const joined = group.join("").split("");
  const set = new Set(joined);
  return set;
}

const getIntersection = (group: Group): Set<string> => {
  let result = new Set(group[0]);
  for (let i = 1; i < group.length; i += 1) {
    const set = new Set(group[i]);
    result = intersection(result, set);
  }
  return result;
}

const day6: ExerciseModuleFunc = async (input: string) => {
  const splitted = input.split("\n\n");
  const groups: Group[] = splitted.map(g => g.split("\n"));

  console.log(groups);

  const prom1 = of(groups).pipe(
    concatAll(),
    map(getUniq),
    map(res => res.size),
    reduce((acc, val) => acc + val)
  ).toPromise();

  const prom2 = of(groups).pipe(
    concatAll(),
    map(getIntersection),
    map(res => res.size),
    reduce((acc, val) => acc + val)
  ).toPromise();

  return Promise.all([prom1, prom2]);
}

export default day6;
