import { AsteroideAppBuilder } from '../builder';
import { SwcAppBuilder } from '../builders';

export function makeSwcBuilder(): AsteroideAppBuilder {
  return new AsteroideAppBuilder(new SwcAppBuilder());
}
