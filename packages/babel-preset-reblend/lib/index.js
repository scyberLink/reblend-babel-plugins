import { declarePreset } from '@babel/helper-plugin-utils';
import transformReblendJSX from 'babel-plugin-transform-reblend-jsx';
import transformReblendJSXDevelopment from 'babel-plugin-transform-reblend-jsx-development';
import transformReblendDisplayName from 'babel-plugin-transform-reblend-display-name';
import transformReblendPure from 'babel-plugin-transform-reblend-pure-annotations';
import normalizeOptions from './normalize-options';
export default declarePreset((api, opts) => {
  api.assertVersion(REQUIRED_VERSION(7));
  const {
    development,
    importSource,
    pragma,
    pragmaFrag,
    pure,
    runtime,
    throwIfNamespace,
  } = normalizeOptions(opts);
  return {
    plugins: [
      [
        development ? transformReblendJSXDevelopment : transformReblendJSX,
        process.env.BABEL_8_BREAKING
          ? {
              importSource,
              pragma,
              pragmaFrag,
              runtime,
              throwIfNamespace,
              pure,
            }
          : {
              importSource,
              pragma,
              pragmaFrag,
              runtime,
              throwIfNamespace,
              pure,
              useBuiltIns: !!opts.useBuiltIns,
              useSpread: opts.useSpread,
            },
      ],
      transformReblendDisplayName,
      pure !== false && transformReblendPure,
    ].filter(Boolean),
  };
});
