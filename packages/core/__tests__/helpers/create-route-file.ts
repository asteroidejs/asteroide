import fs from 'fs';

export function createRouteFile(routeFilePath: string, content: string) {
  const folderPath = `.asteroide/routes/${routeFilePath.split('/').slice(0, -1).join('/')}`;
  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFileSync(
    `.asteroide/routes/${routeFilePath}`.replace('//', '/'),
    content.trim(),
    {
      encoding: 'utf-8',
    },
  );
}
