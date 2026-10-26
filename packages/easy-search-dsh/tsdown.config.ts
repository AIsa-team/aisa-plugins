import { defineConfig } from 'tsdown'

const PACKAGE = '@aisa-plugins/easy-search'
const CLIENT_EXTERNALS = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-runtime/client',
] as const

export default defineConfig([
  {
    name: PACKAGE,
    entry: { index: 'src/index.ts' },
    outDir: 'lib',
    tsconfig: 'tsconfig.host.json',
    format: ['esm'],
    platform: 'node',
    target: 'es2024',
    fixedExtension: false,
    dts: true,
    sourcemap: true,
    clean: true,
    deps: { neverBundle: [/^@deepseek-ai\//] },
  },
  {
    name: `${PACKAGE}/client`,
    entry: { client: 'src/client/index.tsx' },
    outDir: 'lib',
    tsconfig: 'tsconfig.client.json',
    format: 'cjs',
    platform: 'browser',
    target: 'es2022',
    fixedExtension: false,
    dts: false,
    sourcemap: true,
    clean: false,
    inputOptions: options => ({
      ...options,
      resolve: {
        ...options.resolve,
        mainFields: ['browser', 'module', 'main'],
      },
    }),
    deps: {
      neverBundle: [...CLIENT_EXTERNALS],
      onlyBundle: ['@tabler/icons-react'],
      alwaysBundle: (id: string) =>
        CLIENT_EXTERNALS.includes(id as typeof CLIENT_EXTERNALS[number]) ? undefined : true,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
      'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
      'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
    },
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PACKAGE)}, factory: (require) => {`,
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
])
