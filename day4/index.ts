import { Observable, of } from "rxjs";
import { concatAll, count, filter, groupBy, map, mergeMap, reduce, tap } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

interface Passport {
  byr: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
  cid?: string;
}

const parsePassports = (input: string): Passport[] => {
  const sections = input.split("\n\n")
  const splitted = sections.map(s => s.split(/[\n\r\s]+/g));

  const result = splitted.map(s => s.reduce((acc, val) => {
    const [lhs, rhs] = val.split(":");
    acc[lhs] = rhs;
    return acc;
  }, {})) as Passport[];

  return result;
}

const isPassportValid = (passport: Passport): boolean => {
  const requiredKeys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

  let valid = true;
  requiredKeys.forEach(key => {
    if (passport[key] === undefined) {
      valid = false;
    }
  });
  return valid;
}

const day4: ExerciseModuleFunc = async (input: string) => {
  const prom1 = of(input).pipe(
    map(parsePassports),
    concatAll(),
    filter(isPassportValid),
    count()
  ).toPromise();

  return Promise.all([prom1]);
}

export default day4;
