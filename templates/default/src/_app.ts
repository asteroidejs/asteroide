import { Asteroide } from '@asteroidejs/core';

async function runApp() {
  const app = new Asteroide();
  await app.start();
}

runApp().then();
