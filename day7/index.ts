import { of } from "rxjs";
import { concatAll, map, reduce, toArray } from 'rxjs/operators';
import { ExerciseModuleFunc } from "../types";

interface RuleChild {
  type: string;
  num: number;
}

interface Rule {
  type: string;
  children: RuleChild[];
}

interface TreeNode {
  type: string;
  children: TreeNode[];
}

const union = <T extends unknown>(...sets: Set<T>[]): Set<T> => {
  let result = new Set<T>();
  for (const set of sets) {
    result = new Set([...Array.from(result), ...Array.from(set)]);
  }
  return result;
}

const rowToRule = (row: string): Rule => {
  const [lhs, rhs] = row.split("bags contain").map(part => part.trim());

  if (rhs.startsWith("no")) {
    return {
      type: lhs,
      children: []
    }
  }

  const childBags = rhs.split(", ");
  const children = childBags.map(str => {
    const match = str.match(/(\d)\ (\w+\ \w+).*?/);

    const num = Number(match[1]);
    const type = match[2];

    return {
      type,
      num
    }
  });

  return {
    type: lhs,
    children
  }
};

const constructNode = (rules: Rule[], type: string): TreeNode => {
  const children = rules
    .filter(rule => rule.children.some(child => child.type === type))
    .reduce((acc: TreeNode, rule) => {
      const newChild = constructNode(rules, rule.type);
      acc.children.push(newChild);
      return acc;
    }, { type, children: [] });

  return children;
}

const buildTree = (rules: Rule[], rootType: string) => {
  return constructNode(rules, rootType);
}

const uniqueNonRootNodes = (tree: TreeNode): Set<string> => {
  let set = new Set<string>();

  for (let child of tree.children) {
    set.add(child.type);

    const childUniques = uniqueNonRootNodes(child);
    set = union(set, childUniques);
  }

  return set;
}

const day7: ExerciseModuleFunc = async (input: string) => {
  const rows = input.split("\n");

  const prom1 = of(rows).pipe(
    concatAll(),
    map(rowToRule),
    toArray(),
    map(rules => buildTree(rules, "shiny gold")),
    map(tree => uniqueNonRootNodes(tree)),
    map(set => set.size)
  ).toPromise();

  // const prom2 = of(rows).pipe(
  // ).toPromise();

  return Promise.all([prom1]);
}

export default day7;
