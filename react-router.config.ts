import type { Config } from '@react-router/dev/config';
import { vercelPreset } from "@react-router/dev/presets";
export default {
	presets: [vercelPreset()],
	appDirectory: './src/app',
	ssr: true,
	prerender: ['/*?'],
} satisfies Config;
