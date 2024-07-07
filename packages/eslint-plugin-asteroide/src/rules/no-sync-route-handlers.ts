import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import path from 'path';

const createRule = ESLintUtils.RuleCreator(
  () =>
    'https://docs.asteroidejs.com/eslint-plugin/rules/no-sync-route-handlers',
);

export default createRule({
  defaultOptions: [],
  name: 'no-sync-route-handlers',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Prevent synchronous route handlers',
      requiresTypeChecking: true,
    },
    messages: {
      syncHandler: 'Route handlers should be asynchronous',
    },
    schema: [],
  },
  create(ctx) {
    if (!ctx.filename.includes(path.join('src', 'routes'))) {
      return {};
    }

    const whenExportIsArrowFunction = (
      node: TSESTree.ArrowFunctionExpression,
    ) => {
      if (node.parent?.type !== 'VariableDeclarator' || node.async) return;

      ctx.report({
        node,
        messageId: 'syncHandler',
        fix: (fixer) => {
          return fixer.insertTextBefore(node, 'async ');
        },
      });
    };

    const whenExportIsFunctionDeclaration = (
      node: TSESTree.FunctionDeclaration,
    ) => {
      if (node.async) return;

      ctx.report({
        node,
        messageId: 'syncHandler',
        fix: (fixer) => {
          return fixer.insertTextBefore(node, 'async ');
        },
      });
    };

    return {
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        if (!node.declaration) return;

        if (node.declaration.type === 'FunctionDeclaration') {
          whenExportIsFunctionDeclaration(node.declaration);
        }

        if (node.declaration.type === 'VariableDeclaration') {
          node.declaration.declarations.forEach((declaration) => {
            if (declaration.init?.type === 'ArrowFunctionExpression') {
              whenExportIsArrowFunction(declaration.init);
            }
          });
        }
      },
    };
  },
});
