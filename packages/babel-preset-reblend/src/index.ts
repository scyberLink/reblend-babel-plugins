import { declarePreset } from '@babel/helper-plugin-utils';
import transformReblendJSX from 'babel-plugin-transform-reblend-jsx';
import transformReblendJSXDevelopment from 'babel-plugin-transform-reblend-jsx-development';
import transformReblendFunctionToClass from 'babel-plugin-transform-reblend-function-to-class';

import normalizeOptions from './normalize-options';

export interface Options {
  development?: boolean;
  importSource?: string;
  pragma?: string;
  pragmaFrag?: string;
  pure?: string;
  runtime?: 'automatic' | 'classic';
  throwIfNamespace?: boolean;
  useBuiltIns?: boolean;
  useSpread?: boolean;
}

export default declarePreset((api, opts: Options) => {
  //api.assertVersion(REQUIRED_VERSION(7));

  const {
    development,
    importSource,
    pragma = 'Reblend.construct',
    pragmaFrag = 'Reblend',
    pure,
    runtime,
    throwIfNamespace,
  } = normalizeOptions(opts);

  return {
    plugins: [
      transformReblendFunctionToClass,
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
    ].filter(Boolean),
  };
});
