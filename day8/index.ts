import { of } from "rxjs";
import { concatAll, map, reduce, toArray } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

const CODES = ["nop", "acc", "jmp"] as const;

interface Instruction {
  code: typeof CODES[number];
  value: number;
}

const parseToInstruction = (line: string): Instruction => {
  const [codeStr, valStr] = line.split(" ");
  const value = Number(valStr);

  const code = codeStr as Instruction["code"];

  return {
    code,
    value
  }
};

interface GraphNode {
  value: number;
  next: GraphNode | null;
  visited: boolean;
}

const indexToNode: { [index: number]: GraphNode } = {};

const toGraph = (instructions: Instruction[], index: number = 0): GraphNode => {
  const inst = instructions[index];

  if (!inst) return null;

  let nextIndex: number;
  let value: number;

  if (inst.code === "nop") {
    value = 0;
    nextIndex = index + 1;
  } else if (inst.code === "acc") {
    value = inst.value;
    nextIndex = index + 1;
  } else if (inst.code === "jmp") {
    value = 0;
    nextIndex = index + inst.value;
  }

  const node = {
    value,
    next: null,
    visited: false
  };

  indexToNode[index] = node;

  const next = indexToNode[nextIndex] || toGraph(instructions, nextIndex);

  node.next = next;
  return node;
}

const traverseUntilLoop = (graph: GraphNode): GraphNode["value"] => {
  let accum = 0;
  let current = graph;

  while (true) {
    current.visited = true;
    accum += current.value;
    const next = current.next;

    if (next.visited) {
      break;
    } else {
      current = next;
    }
  }

  return accum;
}

const day8: ExerciseModuleFunc = async (input: string) => {
  const lines = input.split("\n");

  const prom1 = of(lines).pipe(
    concatAll(),
    map(parseToInstruction),
    toArray(),
    map(toGraph),
    map(traverseUntilLoop)
  ).toPromise();

  return Promise.all([prom1]);
}

export default day8;
