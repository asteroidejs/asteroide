import { AsteroideAppRunner } from '../asteroide-app-runner';
import { DevAppRunner } from '../runners';
import { AsteroideAppBuilder } from '../asteroide-app-builder';

export function makeDevRunner(
  builder: AsteroideAppBuilder,
): AsteroideAppRunner {
  return new AsteroideAppRunner(builder, new DevAppRunner());
}
