import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        animals: resolve(__dirname, 'html/animals.html'),
        birds: resolve(__dirname, 'html/birds.html'),
        body: resolve(__dirname, 'html/body.html'),
        colors: resolve(__dirname, 'html/colors.html'),
        'colors-page': resolve(__dirname, 'html/colors-page.html'),
        fruits: resolve(__dirname, 'html/fruits.html'),
        transport: resolve(__dirname, 'html/transport.html'),
        vegetables: resolve(__dirname, 'html/vegetables.html'),
        plants: resolve(__dirname, 'html/plants.html'),
        'human-body': resolve(__dirname, 'html/human-body.html'),
        fish: resolve(__dirname, 'html/fish.html'),
        numbers: resolve(__dirname, 'html/numbers.html'),
        time: resolve(__dirname, 'html/time.html')
      }
    },
    emptyOutDir: true
  }
});
