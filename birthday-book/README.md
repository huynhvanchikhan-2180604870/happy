# 🎂 Birthday Book - Trang Web Sinh Nhật 3D Flipbook

Một trang web sinh nhật đặc biệt với hiệu ứng sách lật 3D, thiết kế Liquid Glass hiện đại và Music Player kiểu Spotify.

![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Tính năng

- 📖 **3D Flipbook Effect** - Hiệu ứng lật sách 3D chân thực với react-pageflip
- 🎨 **Liquid Glass Design** - Thiết kế glassmorphism hiện đại và sang trọng
- 🎵 **Music Player** - Trình phát nhạc kiểu Spotify với đầy đủ tính năng
- 📱 **Mobile-First** - Tối ưu hoàn toàn cho thiết bị di động
- ❤️ **Romantic Theme** - Giao diện lãng mạn với màu sắc pastel
- 🎁 **Easter Eggs** - Hiệu ứng ẩn khi tap nhiều lần
- ⚡ **High Performance** - Animations mượt mà 60fps

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone <your-repo-url>
cd birthday-book

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Truy cập `http://localhost:5173` để xem website.

## 📝 Tùy chỉnh nội dung

### 1. Chỉnh sửa thông tin cá nhân

Mở file `public/metadata.json` và chỉnh sửa:

```json
{
  "girlfriendName": "Tên người yêu",
  "birthdayDate": "2025-09-01",
  "age": 22,
  "greeting": {
    "vi": {
      "title": "Tiêu đề lời chúc",
      "message": ["Đoạn 1", "Đoạn 2", "..."]
    }
  }
}
```

### 2. Thêm ảnh

1. Copy ảnh vào thư mục `public/images/`
2. Cập nhật trong `metadata.json`:

```json
"photos": [
  {
    "src": "/images/ten-anh.jpg",
    "caption": "Mô tả ảnh",
    "date": "2024-01-01"
  }
]
```

### 3. Thêm nhạc

1. Copy file nhạc (mp3) vào `public/audio/`
2. Cập nhật playlist trong `metadata.json`:

```json
"music": {
  "playlist": [
    {
      "id": "1",
      "src": "/audio/bai-hat.mp3",
      "title": "Tên bài hát",
      "artist": "Ca sĩ",
      "duration": "3:45"
    }
  ]
}
```

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu sắc

Chỉnh sửa trong `tailwind.config.js`:

```javascript
colors: {
  'romantic': {
    'pink': '#FFB6C1',    // Màu hồng chính
    'rose': '#FFC0CB',    // Màu hồng phụ
    'gold': '#FFD700',    // Màu vàng
    'cream': '#FFF8DC',   // Màu kem
    'lavender': '#E6E6FA' // Màu tím nhạt
  }
}
```

### Thay đổi font chữ

Cập nhật trong `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

## 📦 Build và Deploy

### Build production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

### Deploy lên Netlify

1. Đăng nhập [Netlify](https://netlify.com)
2. Kéo thả thư mục `dist/` vào Netlify
3. Hoặc sử dụng Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy lên Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy lên GitHub Pages

1. Cài đặt gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Thêm vào `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

## 🎯 Cấu trúc dự án

```
birthday-book/
├── public/
│   ├── metadata.json      # File cấu hình nội dung
│   ├── images/            # Thư mục chứa ảnh
│   └── audio/             # Thư mục chứa nhạc
├── src/
│   ├── components/        # React components
│   │   ├── LandingPage.jsx
│   │   ├── FlipBook.jsx
│   │   ├── MusicPlayer.jsx
│   │   └── Loading.jsx
│   ├── contexts/          # React contexts
│   ├── utils/             # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── tailwind.config.js    # TailwindCSS config
├── vite.config.js        # Vite config
└── README.md
```

## 🔧 Tính năng nâng cao

### Easter Eggs
- Tap 7 lần vào bìa sách để hiện message ẩn
- Cấu hình trong `metadata.json`:

```json
"easterEggs": {
  "enabled": true,
  "tapCount": 7,
  "message": "Message ẩn"
}
```

### Particles Effect
- Hiệu ứng trái tim bay
- Cấu hình:

```json
"particles": {
  "enabled": true,
  "type": "hearts",
  "count": 15,
  "speed": "slow"
}
```

## 📱 Responsive Design

Website được tối ưu cho:
- 📱 Mobile: 320px - 768px
- 💻 Tablet: 768px - 1024px  
- 🖥️ Desktop: 1024px+

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

MIT License - Thoải mái sử dụng cho mục đích cá nhân.

## 💝 Credits

Made with love using:
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [react-pageflip](https://github.com/Nodlik/react-pageflip)
- [Lucide Icons](https://lucide.dev/)

---

**Happy Birthday! 🎂🎉**