import html from '@web/rollup-plugin-html';
import {copy} from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import includePaths from 'rollup-plugin-includepaths';

export default {
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: 'frontend/index.html',
      extractAssets: false
    }),
    // Minify HTML template literals
    minifyHTML(),
    sourcemaps(),,
    // Resolve bare module specifiers to relative paths
    resolve(),
    // Minify JS
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    // Optional: copy any static assets to build directory
    copy({
      patterns: [
        'img/*',
        'fonts/**',
        'css/*'
      ],
      rootDir: './frontend'
    }),
    // Use absolute path for imports
    includePaths({
      include: {},
      paths: ['frontend/js'],
      external: [],
      extensions: ['.js', '.json', '.html']
    })
  ],
  output: {
    sourcemap: false,
    dir: 'dist',
  },
  preserveEntrySignatures: 'strict',
};