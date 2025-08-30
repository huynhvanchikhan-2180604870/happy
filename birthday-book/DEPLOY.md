# 🚀 Hướng Dẫn Deploy

## Render.com

### Cách 1: Sử dụng render.yaml (Khuyến nghị)
1. Push code lên GitHub
2. Tạo Static Site trên Render
3. Connect với GitHub repository
4. Render sẽ tự động sử dụng `render.yaml`

### Cách 2: Manual Setup
1. Tạo **Static Site** (không phải Web Service)
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Environment Variables:
   - `NODE_VERSION`: `18` hoặc `20`

## Vercel
```bash
npm install -g vercel
vercel --prod
```

## Netlify
1. Kéo thả thư mục `dist/` vào Netlify
2. Hoặc connect GitHub và set:
   - Build command: `npm run build`
   - Publish directory: `dist`

## GitHub Pages
```bash
npm run deploy:gh-pages
```

## Lưu ý quan trọng:
- ✅ Sử dụng **Static Site** trên Render, không phải Web Service
- ✅ Build Command: `npm run build`
- ✅ Publish Directory: `dist`
- ✅ Không cần start script cho static sites
