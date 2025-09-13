import type { Config } from '@react-router/dev/config';

export default {
	presets: [vercelPreset()],
	appDirectory: './src/app',
	ssr: true,
	prerender: ['/*?'],
} satisfies Config;
