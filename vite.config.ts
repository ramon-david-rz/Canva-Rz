import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { pilotPlugin } from './server/pilot.ts';
export default defineConfig({ plugins: [react(), pilotPlugin(resolve(process.cwd(), '../Proyectos/Piloto-RZ/Episodio-01'))] });
