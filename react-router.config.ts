import { vercelPreset } from "@react-router/dev/presets";
import { defineConfig } from "@react-router/dev/config";

export default {
  presets: [vercelPreset()],
  appDirectory: './src/app',
  ssr: true,
  prerender: ['/*?'],
} satisfies Config;
