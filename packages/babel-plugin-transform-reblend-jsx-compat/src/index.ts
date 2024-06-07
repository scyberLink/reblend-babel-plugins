import { declare } from '@babel/helper-plugin-utils';
import helper from 'babel-helper-builder-reblend-jsx';
import { types as t } from '@babel/core';

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION(7));

  return {
    name: 'transform-reblend-jsx-compat',

    manipulateOptions(_, parserOpts) {
      parserOpts.plugins.push('jsx');
    },

    visitor: helper({
      pre(state) {
        state.callee = state.tagExpr;
      },

      post(state) {
        if (t.react.isCompatTag(state.tagName)) {
          state.call = t.callExpression(
            t.memberExpression(
              t.memberExpression(t.identifier('Reblend'), t.identifier('DOM')),
              state.tagExpr,
              t.isLiteral(state.tagExpr),
            ),
            state.args,
          );
        }
      },
      compat: true,
    }),
  };
});
