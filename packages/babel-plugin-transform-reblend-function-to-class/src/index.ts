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
        enter: functionToClass as any,
      },
    },
  };
}
