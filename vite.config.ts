import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// 공통 설정
const commonConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

// Content Script 전용 설정
const contentConfig = defineConfig({
  ...commonConfig,
  build: {
    rollupOptions: process.env.COMPONENT_NAME
      ? {
          input: `./src/components/preview/${process.env.COMPONENT_NAME}.tsx`,
        }
      : {
          input: './src/content.tsx', // content.tsx만 빌드
          output: {
            format: 'iife', // IIFE 형식
            entryFileNames: 'content.js',
          },
        },
    outDir: 'dist', // 별도의 출력 디렉토리
    emptyOutDir: false, // 기존 빌드 결과 유지
  },
});

// Background 및 Popup 전용 설정
const mainConfig = defineConfig({
  ...commonConfig,
  build: {
    rollupOptions: {
      input: {
        background: './src/background.ts', // Background Script
        popup: './index.html', // Popup HTML
      },
      output: {
        format: 'es', // ESModules 형식
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true, // 기본 빌드 시 디렉토리 초기화
  },
});

// Vite CLI에서 빌드 모드를 기반으로 설정 반환
export default defineConfig(({ mode }) => {
  if (mode === 'content') return contentConfig; // Content Script 전용 설정
  return mainConfig; // 기본 설정
});
