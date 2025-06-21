import { Visitor } from '@babel/core';
import functionToClass from './functionToClass';
import {
  findReblendImportName,
  REBLEND_IMPORT_NAME_ID,
  get,
  set,
} from './utils';

export default function (): { visitor: Visitor; name: string } {
  return {
    name: 'transform-reblend-function-to-class',
    visitor: {
      Program(path: any, state: any) {
        // Skip transforming files from node_modules or other external libraries
        if (state.filename && state.filename.includes('/node_modules/')) {
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

        path.traverse({
          Function(functionPath: any) {
            functionToClass(functionPath, state);
          },
        });
      },
    },
  };
}
