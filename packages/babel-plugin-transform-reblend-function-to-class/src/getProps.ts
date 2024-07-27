import * as t from '@babel/types';

function getProps(
  node: t.Function,
):
  | (t.RestElement | t.ObjectProperty)[]
  | (
      | t.Identifier
      | t.AssignmentPattern
      | t.ArrayPattern
      | t.RestElement
      | t.TSParameterProperty
    )[] {
  if (node.params.length < 1) return [];

  const prop: any = node.params.pop();

  return t.isObjectPattern(prop)
    ? (prop as t.ObjectPattern).properties
    : [prop];
}

export default getProps;
