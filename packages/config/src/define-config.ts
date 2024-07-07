import { AsteroideConfig } from './types';

export function defineConfig(config: AsteroideConfig) {
  const _config: AsteroideConfig = {
    logger: {
      timestamp: config.logger?.timestamp ?? true,
    },
  };
  return Object.freeze(_config);
}
