export default {
  env: {
    es2024: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['asteroid'],
  rules: {
    'asteroide/no-default-route-handler-export': 'error',
    'asteroide/no-sync-route-handlers': 'error',
    'asteroide/only-export-http-methods': 'error',
  },
};
