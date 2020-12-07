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

interface TreeNode1 {
  type: string;
  children: TreeNode1[];
}

interface TreeNode2 {
  type: string;
  children: TreeNode2[];
  num: number;
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

const buildTree1 = (rules: Rule[], type: string): TreeNode1 => {
  const initial: TreeNode1 = { type, children: [] };

  const node: TreeNode1 = rules
    .filter(rule => rule.children.some(child => child.type === type))
    .reduce((acc: TreeNode1, ruleWithNum) => {
      const newChild = buildTree1(rules, ruleWithNum.type);
      acc.children.push(newChild);
      return acc;
    }, initial);

  return node;
}

const uniqueNonRootNodes = (tree: TreeNode1): Set<string> => {
  let set = new Set<string>();

  for (let child of tree.children) {
    set.add(child.type);

    const childUniques = uniqueNonRootNodes(child);
    set = union(set, childUniques);
  }

  return set;
}

const buildTree2 = (rules: Rule[], type: string): TreeNode2 => {
  const rule = rules.find(rule => rule.type === type);

  const node: TreeNode2 = {
    type: rule.type,
    children: [],
    num: 0
  };

  for (let child of rule.children) {
    const childNode = buildTree2(rules, child.type);
    node.children.push(childNode);
    node.num += child.num + child.num * childNode.num;
  }

  return node;
}

const day7: ExerciseModuleFunc = async (input: string) => {
  const rows = input.split("\n");

  const prom1 = of(rows).pipe(
    concatAll(),
    map(rowToRule),
    toArray(),
    map(rules => buildTree1(rules, "shiny gold")),
    map(tree => uniqueNonRootNodes(tree)),
    map(set => set.size)
  ).toPromise();

  const prom2 = of(rows).pipe(
    concatAll(),
    map(rowToRule),
    toArray(),
    map(rules => buildTree2(rules, "shiny gold")),
    map(tree => tree.num)
  ).toPromise();

  return Promise.all([prom1, prom2]);
}

export default day7;
