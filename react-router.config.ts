import { defineConfig } from "@react-router/dev/config";

export default {
  appDirectory: './src/app',
  ssr: true,
  prerender: ['/*?'],
} satisfies Config;
