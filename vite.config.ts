import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Plugin to handle figma:asset/* imports by resolving to placeholder SVGs
function figmaAssetPlugin() {
  const placeholderModule = `
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, 800, 600);
ctx.fillStyle = '#4AF2E5';
ctx.font = '24px system-ui';
ctx.textAlign = 'center';
ctx.fillText('Image Placeholder', 400, 300);
export default canvas.toDataURL();
`;

  return {
    name: 'figma-asset-plugin',
    resolveId(source: string) {
      if (source.startsWith('figma:asset/')) {
        return `\0figma-asset:${source}`;
      }
    },
    load(id: string) {
      if (id.startsWith('\0figma-asset:')) {
        return placeholderModule;
      }
    }
  };
}

export default defineConfig({
  plugins: [
    figmaAssetPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  }
});
