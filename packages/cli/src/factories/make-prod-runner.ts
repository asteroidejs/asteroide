import { AsteroideAppRunner } from '../asteroide-app-runner';
import { ProdAppRunner } from '../runners';
import { AsteroideAppBuilder } from '../asteroide-app-builder';

export function makeProdRunner(
  builder: AsteroideAppBuilder,
): AsteroideAppRunner {
  return new AsteroideAppRunner(builder, new ProdAppRunner());
}
