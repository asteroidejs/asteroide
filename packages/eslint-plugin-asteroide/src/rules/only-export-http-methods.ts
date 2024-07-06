import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import path from 'path';
import { HTTP_METHODS, HttpMethods } from '@asteroidejs/common';

const createRule = ESLintUtils.RuleCreator(
  () =>
    'https://docs.asteroidejs.com/eslint-plugin/rules/only-export-http-methods',
);

export default createRule({
  defaultOptions: [],
  name: 'only-export-http-methods',
  meta: {
    type: 'layout',
    docs: {
      description:
        'Prevent route handler files from exporting anything other than HTTP methods',
      requiresTypeChecking: true,
    },
    messages: {
      httpMethodExport:
        'Route handler files should only export functions named after HTTP methods',
    },
    schema: [],
  },
  create(ctx) {
    if (!ctx.filename.includes(path.join('src', 'routes'))) {
      return {};
    }

    const whenExportIsFunctionDeclaration = (
      node: TSESTree.FunctionDeclaration,
    ) => {
      if (HTTP_METHODS.includes((node.id?.name ?? '') as HttpMethods)) return;
      {
        ctx.report({
          node,
          messageId: 'httpMethodExport',
        });
      }
    };

    const whenExportIsArrowFunction = (
      node: TSESTree.ArrowFunctionExpression,
    ) => {
      if (node.parent.type !== 'VariableDeclarator') return;
      const { id } = node.parent;
      if (id?.type !== 'Identifier') return;
      if (HTTP_METHODS.includes(id.name as HttpMethods)) return;
      {
        ctx.report({
          node,
          messageId: 'httpMethodExport',
        });
      }
    };

    return {
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        if (node.declaration?.type === 'FunctionDeclaration') {
          return whenExportIsFunctionDeclaration(node.declaration);
        } else if (node.declaration?.type === 'VariableDeclaration') {
          for (const declaration of node.declaration.declarations) {
            if (declaration.init?.type === 'ArrowFunctionExpression') {
              return whenExportIsArrowFunction(declaration.init);
            }
          }
        }
      },
    };
  },
});
