// vite.config.js
import { defineConfig } from "file:///C:/Users/marin/Documents/Faculty/Year2/Semester2/MPP/PaintingSuppliesProject/PaintingSuppliesFrontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/marin/Documents/Faculty/Year2/Semester2/MPP/PaintingSuppliesProject/PaintingSuppliesFrontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  server: {
    proxy: {
      "/api1": {
        target: "http://api1:8002",
        changeOrigin: true
      }
      //,
      // '/api2': {
      //   target: 'http://api2:5000',
      //   changeOrigin: true,
      // }
    }
  },
  plugins: [react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYXJpblxcXFxEb2N1bWVudHNcXFxcRmFjdWx0eVxcXFxZZWFyMlxcXFxTZW1lc3RlcjJcXFxcTVBQXFxcXFBhaW50aW5nU3VwcGxpZXNQcm9qZWN0XFxcXFBhaW50aW5nU3VwcGxpZXNGcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWFyaW5cXFxcRG9jdW1lbnRzXFxcXEZhY3VsdHlcXFxcWWVhcjJcXFxcU2VtZXN0ZXIyXFxcXE1QUFxcXFxQYWludGluZ1N1cHBsaWVzUHJvamVjdFxcXFxQYWludGluZ1N1cHBsaWVzRnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL21hcmluL0RvY3VtZW50cy9GYWN1bHR5L1llYXIyL1NlbWVzdGVyMi9NUFAvUGFpbnRpbmdTdXBwbGllc1Byb2plY3QvUGFpbnRpbmdTdXBwbGllc0Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGkxJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vYXBpMTo4MDAyJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfS8vLFxuICAgICAgLy8gJy9hcGkyJzoge1xuICAgICAgLy8gICB0YXJnZXQ6ICdodHRwOi8vYXBpMjo1MDAwJyxcbiAgICAgIC8vICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgLy8gfVxuICAgIH1cbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCldLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFmLFNBQVMsb0JBQW9CO0FBQ2xoQixPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQ25CLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
