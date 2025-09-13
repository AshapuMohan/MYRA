import { defineConfig } from "@react-router/dev/config";

export default defineConfig({
  appDirectory: './src/app',
  ssr: true,
  prerender: ['/*?'],
});
