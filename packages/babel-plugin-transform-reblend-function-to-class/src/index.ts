import { Visitor } from '@babel/core';
import functionToClass from './functionToClass';
import {
  findReblendImportName,
  REBLEND_IMPORT_NAME_ID,
  get,
  set,
} from './utils';

export default function (): { visitor: Visitor } {
  return {
    visitor: {
      Program: {
        enter(path: any, state: any) {
          // Skip transforming files from node_modules or other external libraries
          if (state.filename && state.filename.includes('/node_modules/')) {
            state.__skipReblendTransform = true;
            return;
          }
          let reblendImportName: string | undefined = get(
            state,
            REBLEND_IMPORT_NAME_ID,
          );
          if (!reblendImportName) {
            reblendImportName = findReblendImportName(path);
            set(state, REBLEND_IMPORT_NAME_ID, reblendImportName);
          }
        },
      },

      Function: {
        enter(path: any, state: any) {
          if (state.__skipReblendTransform) return;
          (functionToClass as any)(path, state);
        },
      },
    },
  };
}
