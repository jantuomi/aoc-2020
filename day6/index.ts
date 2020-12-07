import { of } from "rxjs";
import { concatAll, map, reduce } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

type Group = string[];

const getUniq = (group: Group): Set<string> => {
  const joined = group.join("").split("");
  const set = new Set(joined);
  return set;
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

  return Promise.all([prom1]);
}

export default day6;
