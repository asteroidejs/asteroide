import fs from 'fs';

export function removeAlaskaFolder() {
  fs.rmSync('.asteroide', { recursive: true, force: true });
}
