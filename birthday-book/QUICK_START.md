# 🚀 HƯỚNG DẪN SỬ DỤNG NHANH

## 📦 Dự án đã sẵn sàng!

Trang web sinh nhật với hiệu ứng sách 3D đã được tạo thành công với đầy đủ tính năng:

✅ **Flipbook 3D** - Hiệu ứng lật sách chân thực  
✅ **Liquid Glass Design** - Giao diện glassmorphism hiện đại  
✅ **Music Player** - Trình phát nhạc kiểu Spotify  
✅ **Mobile-First** - Tối ưu hoàn toàn cho điện thoại  
✅ **Animations** - Hiệu ứng mượt mà 60fps  

## 🎯 Bắt đầu ngay

### 1️⃣ Chạy thử ngay:
```bash
npm run dev
```
Mở trình duyệt: http://localhost:5173

### 2️⃣ Tùy chỉnh nội dung:

#### 📝 Sửa thông tin cá nhân:
Mở file `public/metadata.json`:
- Đổi tên: `"girlfriendName": "Tên của em"`
- Đổi ngày sinh: `"birthdayDate": "2025-09-01"`
- Sửa lời chúc trong phần `"greeting"`

#### 🖼️ Thêm ảnh:
1. Copy ảnh vào `public/images/`
2. Cập nhật trong `metadata.json`:
```json
"photos": [
  {
    "src": "/images/anh1.jpg",
    "caption": "Kỷ niệm đẹp"
  }
]
```

#### 🎵 Thêm nhạc:
1. Copy file .mp3 vào `public/audio/`
2. Cập nhật playlist trong `metadata.json`:
```json
"playlist": [
  {
    "src": "/audio/baihat.mp3",
    "title": "Tên bài hát",
    "artist": "Ca sĩ"
  }
]
```

### 3️⃣ Build & Deploy:

#### Build production:
```bash
npm run build
```

#### Deploy lên Netlify (dễ nhất):
1. Vào https://app.netlify.com
2. Kéo thả thư mục `dist/` vào

#### Deploy lên Vercel:
```bash
vercel --prod
```

## 🎁 Tính năng đặc biệt

### Easter Egg:
- Tap 7 lần vào bìa sách để hiện message bí mật
- Sửa trong `metadata.json` > `"easterEggs"`

### Particles Effect:
- Trái tim bay lượn romantic
- Bật/tắt trong `metadata.json` > `"particles"`

### Music Player:
- Tự động phát nhạc khi mở
- Shuffle, repeat, volume control
- Queue management

## 📱 Test trên điện thoại

1. Chạy: `npm run dev -- --host`
2. Quét QR code hoặc nhập IP hiển thị
3. Test trên điện thoại thật

## 🆘 Hỗ trợ

Nếu gặp lỗi:
```bash
# Xóa cache và cài lại
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## ✨ Tips

- Ảnh nên có kích thước < 500KB để load nhanh
- Nhạc format .mp3 cho tương thích tốt nhất
- Test kỹ trên mobile trước khi gửi
- Có thể thêm domain riêng sau khi deploy

---

**🎂 Chúc bạn gái của bạn có một sinh nhật thật đặc biệt! 🎉**