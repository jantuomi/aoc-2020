import { of } from "rxjs";
import { concatAll, count, filter, map, take } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

interface Row1 {
  min: number;
  max: number;
  letter: string;
  pwd: string;
}

interface Row2 {
  index1: number;
  index2: number;
  letter: string;
  pwd: string;
}

const parse1 = (line: string): Row1 => {
  const re = /(\d+)-(\d+) (\w{1}): (\w+)/;
  const match = line.match(re);

  return {
    min: Number(match[1]),
    max: Number(match[2]),
    letter: match[3],
    pwd: match[4]
  }
}

const parse2 = (line: string): Row2 => {
  const re = /(\d+)-(\d+) (\w{1}): (\w+)/;
  const match = line.match(re);

  return {
    index1: Number(match[1]) - 1,
    index2: Number(match[2]) - 1,
    letter: match[3],
    pwd: match[4]
  }
}

const isValid1 = (r: Row1): boolean => {
  let count = 0;
  r.pwd.split("").forEach(char => {
    if (char === r.letter) {
      count += 1;
    }
  });
  return count >= r.min && count <= r.max;
}

const isValid2 = (r: Row2): boolean => {
  const a = r.pwd[r.index1] === r.letter;
  const b = r.pwd[r.index2] === r.letter;
  return (a && !b) || (!a && b);
}

const day2: ExerciseModuleFunc = async (input: string) => {
  const lines = input.split("\n");

  const prom1 = of(lines).pipe(
    concatAll(),
    map(parse1),
    filter(isValid1),
    count()
  ).toPromise();

  const prom2 = of(lines).pipe(
    concatAll(),
    map(parse2),
    filter(isValid2),
    count()
  ).toPromise();

  return Promise.all([prom1, prom2]);
}

export default day2;
