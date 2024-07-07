import { AsteroideAppBuilder } from '../asteroide-app-builder';
import { SwcAppBuilder } from '../builders';

export function makeSwcBuilder(): AsteroideAppBuilder {
  return new AsteroideAppBuilder(new SwcAppBuilder());
}
