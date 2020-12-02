import { of } from "rxjs";
import { concatAll, count, filter, map, take } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

interface Row {
  min: number;
  max: number;
  letter: string;
  pwd: string;
}

const parse = (line: string): Row => {
  const re = /(\d+)-(\d+) (\w{1}): (\w+)/;
  const match = line.match(re);

  return {
    min: Number(match[1]),
    max: Number(match[2]),
    letter: match[3],
    pwd: match[4]
  }
}

const isValid = (r: Row): boolean => {
  let count = 0;
  r.pwd.split("").forEach(char => {
    if (char === r.letter) {
      count += 1;
    }
  });
  return count >= r.min && count <= r.max;
}

const day2: ExerciseModuleFunc = async (input: string) => {
  const lines = input.split("\n");

  const prom1 = of(lines).pipe(
    concatAll(),
    map(parse),
    filter(isValid),
    count()
  ).toPromise();

  return [await prom1];
}

export default day2;
