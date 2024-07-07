import { version } from '../../package.json';
import picocolors from 'picocolors';

export function printCliVersion() {
  console.log(picocolors.blue(`\n>_ Asteroide CLI v${version}\n`));
}
