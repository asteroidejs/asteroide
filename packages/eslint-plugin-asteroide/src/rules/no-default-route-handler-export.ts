import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import path from 'path';

const createRule = ESLintUtils.RuleCreator(
  () =>
    'https://docs.asteroidejs.com/eslint-plugin/rules/no-default-route-handler-export',
);

export default createRule({
  defaultOptions: [],
  name: 'no-default-route-handler-export',
  meta: {
    type: 'layout',
    docs: {
      description: 'Prevent default route handler export',
      requiresTypeChecking: true,
    },
    messages: {
      defaultExport: 'Route handler files should not have a default export',
    },
    schema: [],
  },
  create(ctx) {
    if (!ctx.filename.includes(path.join('src', 'routes'))) {
      return {};
    }

    return {
      ExportDefaultDeclaration(node: TSESTree.ExportDefaultDeclaration) {
        ctx.report({
          node,
          messageId: 'defaultExport',
        });
      },
    };
  },
});
