const fs = require('fs');
const { resolve } = require('path');

function importJSON(path) {
  return JSON.parse(fs.readFileSync(path));
}

const rootURL = resolve(__dirname, '../');

function getTsPkgs(subRoot) {
  return fs
    .readdirSync(resolve(rootURL, subRoot))
    .filter(name => name.startsWith('babel-'))
    .map(name => ({
      name: name/* .replace(/^babel-/, '@babel/') */,
      relative: `./${subRoot}/${name}`,
    }))
    .filter(({ name, relative }) => {
      const ret =
        // They are special-cased because them dose not have a index.ts
        name === '@babel/register' ||
        name === '@babel/cli' ||
        name === '@babel/node' ||
        name === '@babel/eslint-parser' ||
        // @babel/compat-data is used by preset-env
        name === '@babel/compat-data' ||
        fs.existsSync(resolve(rootURL, relative + '/src/index.ts'));
      if (!ret) {
        console.log(`Skipping ${name} for tsconfig.json`);
      }
      return ret;
    })
    .map(({ name, relative }) => {
      const packageJSON = importJSON(
        resolve(rootURL, relative + '/package.json')
      );
      try {
        fs.rmSync(resolve(rootURL, relative + '/tsconfig.json'));
      } catch (err) {
        /* empty */
      }
      // Babel 8 exports > Babel 7 exports > {}
      const exports =
        packageJSON.conditions?.BABEL_8_BREAKING?.[0]?.exports ??
        packageJSON.exports ??
        {};
      const subExports = Object.entries(exports).flatMap(
        ([_export, exportPath]) => {
          // The @babel/standalone has babel.js as exports, but we don't have src/babel.ts
          if (name === '@babel/standalone') {
            return [['', '/src']];
          }
          if (name === '@babel/compat-data') {
            // map ./plugins to ./data/plugins.json
            const subExport = _export.slice(1);
            const subExportPath = exportPath
              .replace('./', '/data/')
              .replace(/\.js$/, '.json');
            return [[subExport, subExportPath]];
          }
          // [{esm, default}, "./lib/index.js"]
          if (Array.isArray(exportPath)) {
            exportPath = exportPath[1];
          }
          if (typeof exportPath === 'object') {
            exportPath = exportPath.default;
          }
          if (exportPath.startsWith('./lib') && exportPath.endsWith('.js')) {
            // remove the leading `.` and trailing `.js`
            const subExport = _export.slice(1).replace(/\.js$/, '');
            const subExportPath = exportPath
              .replace('./lib', '/src')
              .replace(/\.js$/, '.ts')
              .replace(/\/index\.ts$/, '');
            return [[subExport, subExportPath]];
          }
          return [];
        }
      );
      const dependencies = new Set([
        '@babel/helper-plugin-utils', // used in /lib/third-party.d.ts
        ...Object.keys(packageJSON.dependencies ?? {}),
        ...Object.keys(packageJSON.devDependencies ?? {}).filter(
          n =>
            name === '@babel/standalone' ||
            (!n.startsWith('@babel/plugin-') && !n.startsWith('@babel/preset-'))
        ),
        ...Object.keys(packageJSON.peerDependencies ?? {}),
      ]);
      return [
        name,
        {
          name,
          relative,
          subExports,
          dependencies,
          dfsOutIndex: -1,
          cycleRoot: name,
        },
      ];
    });
}

const tsPkgs = new Map([...getTsPkgs('packages')]);

const roots = new Set(tsPkgs.keys());

tsPkgs.forEach(({ dependencies }) => {
  dependencies.forEach(dep => {
    if (!tsPkgs.has(dep)) dependencies.delete(dep);
    roots.delete(dep);
  });
});

const seen = new Set();
const stack = [];
let index = 0;
for (const name of roots) {
  (function dfs(node) {
    if (seen.has(node)) {
      if (stack.includes(node.cycleRoot)) {
        for (
          let i = stack.length - 1;
          i >= 0 && stack[i] !== node.cycleRoot;
          i--
        ) {
          tsPkgs.get(stack[i]).cycleRoot = node.cycleRoot;
        }
      }
      return;
    }
    seen.add(node);
    stack.push(node.name);
    for (const dep of node.dependencies) {
      dfs(tsPkgs.get(dep));
    }
    stack.pop();
    node.dfsOutIndex = index++;
  })(tsPkgs.get(name));
}

// Find strongly connected components
const sccs = new Map();
for (const [name, node] of tsPkgs) {
  let { cycleRoot } = node;
  if (name !== cycleRoot) {
    let rootNode = tsPkgs.get(cycleRoot);
    while (rootNode.name !== rootNode.cycleRoot) {
      ({ cycleRoot } = rootNode);
      rootNode = tsPkgs.get(cycleRoot);
    }
    if (!sccs.has(cycleRoot)) sccs.set(cycleRoot, [cycleRoot]);
    sccs.get(cycleRoot).push(name);
    node.dfsOutIndex = tsPkgs.get(cycleRoot).dfsOutIndex;
    node.cycleRoot = cycleRoot;
  }
}
sccs.forEach(scc => {
  console.log('SCC:', scc.join(' <> '));
});

const topoSorted = Array.from(tsPkgs.values()).sort((a, b) => {
  return a.dfsOutIndex - b.dfsOutIndex;
});

const projectsFolders = new Map();

for (let i = 0; i < topoSorted.length; i++) {
  const root = tsPkgs.get(topoSorted[i].cycleRoot);
  const chunk = [topoSorted[i]];
  const index = root.dfsOutIndex;
  while (i + 1 < topoSorted.length && topoSorted[i + 1].dfsOutIndex === index) {
    i++;
    chunk.push(topoSorted[i]);
  }
  chunk.sort();

  const allDeps = new Set();
  chunk.forEach(({ name, dependencies }) => {
    dependencies.forEach(allDeps.add, allDeps);
    projectsFolders.set(name, root.relative);
  });
  chunk.forEach(({ name }) => allDeps.delete(name));

  const tsConfig = buildTSConfig(chunk, allDeps);

  fs.writeFileSync(
    resolve(rootURL, root.relative + '/tsconfig.json'),
    '/* This file is automatically generated by scripts/generators/tsconfig.js */\n' +
      JSON.stringify(tsConfig, null, 2)
  );
}

function buildTSConfig(pkgs, allDeps) {
  const paths = {};
  const referencePaths = new Set();

  for (const name of allDeps) {
    const { relative, subExports } = tsPkgs.get(name);
    for (const [subExport, subExportPath] of subExports) {
      paths[name + subExport] = ['../../' + relative.slice(2) + subExportPath];
    }
    referencePaths.add('../../' + projectsFolders.get(name).slice(2));
  }

  return {
    extends: ['../../tsconfig.base.json', '../../tsconfig.paths.json'],
    include: pkgs
      .map(({ name, relative }) => {
        return name === '@babel/eslint-parser'
          ? `../../${relative.slice(2)}/src/**/*.cts`
          : `../../${relative.slice(2)}/src/**/*.ts`;
      })
      .concat(
        [
          '../../lib/globals.d.ts',
          '../../scripts/repo-utils/*.d.ts',
          pkgs.some(p => p.name === '@babel/parser')
            ? '../../packages/babel-parser/typings/*.d.ts'
            : null,
        ].filter(Boolean)
      ),
    references: Array.from(referencePaths, path => ({ path })),
  };
}

fs.writeFileSync(
  resolve(rootURL, 'tsconfig.paths.json'),
  '/* This file is automatically generated by scripts/generators/tsconfig.js */\n' +
    JSON.stringify(
      {
        compilerOptions: {
          paths: Object.fromEntries([
            ...Array.from(tsPkgs.values()).flatMap(
              ({ name, relative, subExports }) => {
                return subExports.map(([subExport, subExportPath]) => {
                  return [name + subExport, [relative + subExportPath]];
                });
              }
            ),
          ]),
        },
      },
      null,
      2
    )
);

fs.writeFileSync(
  resolve(rootURL, 'tsconfig.json'),
  '/* This file is automatically generated by scripts/generators/tsconfig.js */\n' +
    JSON.stringify(
      {
        extends: ['./tsconfig.base.json', './tsconfig.paths.json'],
        compilerOptions: {
          skipLibCheck: false,
        },
        include: ['packages/babel-parser/typings/*.d.ts', 'dts/**/*.d.ts'],
        references: Array.from(new Set(projectsFolders.values()))
          .sort()
          .map(path => ({ path })),
      },
      null,
      2
    )
);
