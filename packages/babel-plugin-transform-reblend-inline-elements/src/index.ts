import { declare } from '@babel/helper-plugin-utils';
import helper from 'babel-helper-builder-reblend-jsx';
import { types as t } from '@babel/core';

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION(7));

  function hasRefOrSpread(attrs: t.JSXOpeningElement['attributes']) {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (t.isJSXSpreadAttribute(attr)) return true;
      if (isJSXAttributeOfName(attr, 'ref')) return true;
    }
    return false;
  }

  function isJSXAttributeOfName(attr: t.JSXAttribute, name: string) {
    return (
      t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: name })
    );
  }

  const visitor = helper({
    filter(node) {
      return (
        node.type === 'JSXElement' &&
        !hasRefOrSpread(node.openingElement.attributes)
      );
    },
    pre(state) {
      const tagName = state.tagName;
      const args = state.args;
      if (t.reblend.isCompatTag(tagName)) {
        args.push(t.stringLiteral(tagName));
      } else {
        args.push(state.tagExpr);
      }
    },
    post(state, pass) {
      state.callee = pass.addHelper('jsx');
      // NOTE: The arguments passed to the "jsx" helper are:
      //   (element, props, key, ...children) or (element, props)
      // The argument generated by the helper are:
      //   (element, { ...props, key }, ...children)

      const props = state.args[1];
      let hasKey = false;
      if (t.isObjectExpression(props)) {
        const keyIndex = props.properties.findIndex(prop =>
          // @ts-expect-error todo(flow->ts) key does not exist on SpreadElement
          t.isIdentifier(prop.key, { name: 'key' })
        );
        if (keyIndex > -1) {
          // @ts-expect-error todo(flow->ts) value does not exist on ObjectMethod
          state.args.splice(2, 0, props.properties[keyIndex].value);
          props.properties.splice(keyIndex, 1);
          hasKey = true;
        }
      } else if (t.isNullLiteral(props)) {
        state.args.splice(1, 1, t.objectExpression([]));
      }

      if (!hasKey && state.args.length > 2) {
        state.args.splice(2, 0, t.unaryExpression('void', t.numericLiteral(0)));
      }

      state.pure = true;
    },
  });
  return {
    name: 'transform-reblend-inline-elements',
    visitor,
  };
});
