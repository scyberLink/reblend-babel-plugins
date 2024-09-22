import * as t from '@babel/types';

function getProps(node: t.Function) {
  return node.params || []; /* .length < 1
    ? []
    : t.isObjectPattern(node.params[0])
      ? (node.params[0] as t.ObjectPattern).properties
      : [node.params[0]]; */
}

export default getProps;
