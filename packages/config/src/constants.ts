import path from 'path';

export const CONFIG_FILE_NAMES = ['asteroide.config.js', 'asteroide.config.js'];

export const CONFIG_FILE_REGEXS = [
  /\/asteroide\.config\.js$/,
  /\/asteroide\.config\.json$/,
];

export const DIST_FOLDER = path.resolve(process.cwd(), '.asteroide');
export const SOURCE_FOLDER = path.resolve(process.cwd(), 'src');
export const ROUTES_FOLDER = path.resolve(DIST_FOLDER, 'routes');
export const MAIN_FILE = path.resolve(SOURCE_FOLDER, '_app.ts');
