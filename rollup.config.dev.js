import html from '@web/rollup-plugin-html';
import {copy} from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';

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
    // Print bundle summary
    summary(),
    // Optional: copy any static assets to build directory
    copy({
      patterns: [
        'img/*',
        'fonts/**',
        'css/*'
      ],
      rootDir: './frontend'
    }),
  ],
  output: {
    sourcemap: true,
    dir: 'dist',
  },
  preserveEntrySignatures: 'strict',
};