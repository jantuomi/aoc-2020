import * as fs from "fs";
import { ExerciseModuleFunc } from "./types";
const args = process.argv;

const exerciseName = args[2];
const modulePath = `./${exerciseName}`;

const inputPath = `./${exerciseName}/input.txt`;
const inputBuffer: Buffer = fs.readFileSync(inputPath);
const inputText = inputBuffer.toString();

import(modulePath).then(m => {
  const defaultFunc = m.default as ExerciseModuleFunc;
  defaultFunc(inputText);
}).catch(err => {
  console.error(err);
});
