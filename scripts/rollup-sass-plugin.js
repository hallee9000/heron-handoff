import path from 'path';
import { pathToFileURL } from 'url';
import * as sass from 'sass';

const stylesheetPattern = /\.(scss|sass|css)$/;

export default function sassPlugin({ production = false } = {}) {
  const styles = new Map();

  return {
    name: 'sass',
    transform(code, id) {
      if (!stylesheetPattern.test(id)) {
        return null;
      }

      this.addWatchFile(id);
      const css = id.endsWith('.css')
        ? code
        : sass.compileString(code, {
          loadPaths: [path.resolve('src'), path.resolve('node_modules')],
          style: production ? 'compressed' : 'expanded',
          url: pathToFileURL(id)
        }).css;

      styles.set(id, css);
      return { code: '', map: { mappings: '' } };
    },
    generateBundle(outputOptions) {
      if (styles.size === 0) {
        return;
      }

      const outputFile = outputOptions.file || 'bundle.js';
      const fileName = path.basename(outputFile).replace(/\.js$/, '.css');

      this.emitFile({
        type: 'asset',
        fileName,
        source: Array.from(styles.values()).join('\n')
      });
    }
  };
}
