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

const requiredFieldsPresent = (passport: Passport): boolean => {
  const requiredKeys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

  let valid = true;
  requiredKeys.forEach(key => {
    if (passport[key] === undefined) {
      valid = false;
    }
  });
  return valid;
}

const byrValid = (byr: string): boolean => {
  const match = byr.match(/\d{4}/);
  if (!match) return false;
  const val = Number(match[0]);
  return val >= 1920 && val <= 2002;
}

const iyrValid = (iyr: string): boolean => {
  const match = iyr.match(/\d{4}/);
  if (!match) return false;
  const val = Number(match[0]);
  return val >= 2010 && val <= 2020;
}

const eyrValid = (eyr: string): boolean => {
  const match = eyr.match(/\d{4}/);
  if (!match) return false;
  const val = Number(match[0]);
  return val >= 2020 && val <= 2030;
}

const hgtValid = (hgt: string): boolean => {
  const match = hgt.match(/(\d{2,3})(cm|in)/);
  if (!match) return false;
  const val = Number(match[1]);
  const unit = match[2];
  return (unit === "cm" && val >= 150 && val <= 193) || (unit === "in" && val >= 59 && val <= 76);
}

const hclValid = (hcl: string): boolean => !!hcl.match(/\#[0-9a-f]{6}/);

const eclValid = (ecl: string): boolean => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(ecl);

const pidValid = (pid: string): boolean => !!pid.match(/\d{9}/);

const isPassportValid = (passport: Passport): boolean =>
  requiredFieldsPresent(passport)
  && byrValid(passport.byr)
  && iyrValid(passport.iyr)
  && eyrValid(passport.eyr)
  && hgtValid(passport.hgt)
  && hclValid(passport.hcl)
  && eclValid(passport.ecl)
  && pidValid(passport.pid)

const day4: ExerciseModuleFunc = async (input: string) => {
  const prom1 = of(input).pipe(
    map(parsePassports),
    concatAll(),
    filter(requiredFieldsPresent),
    count()
  ).toPromise();

  const prom2 = of(input).pipe(
    map(parsePassports),
    concatAll(),
    filter(isPassportValid),
    count()
  ).toPromise();

  return Promise.all([prom1, prom2]);
}

export default day4;
