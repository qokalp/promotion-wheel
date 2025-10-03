# 🚀 Basit Deployment Rehberi - Promotion Wheel

Bu rehber, Google Apps Script olmadan, doğrudan Google Sheets API kullanarak uygulamayı deploy etmeyi gösterir.

## 📋 Gereksinimler

- [ ] Google hesabı
- [ ] Cloudflare hesabı (ücretsiz)
- [ ] Git repository (GitHub, GitLab, vb.)
- [ ] Node.js 18+ (yerel kurulum)

## 🔧 Adım 1: Google Sheets Hazırlığı

### 1.1 Google Sheet Oluşturma

1. [Google Sheets](https://sheets.google.com) adresine gidin
2. Yeni bir spreadsheet oluşturun
3. Adını "Promotion Wheel Results" yapın
4. **URL'den Sheet ID'yi kopyalayın**: 
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

### 1.2 Sheet Yapısını Hazırlama

1. **İlk satırı başlık olarak ayarlayın**:
   - A1: `Timestamp`
   - B1: `FullName` 
   - C1: `Phone`
   - D1: `Prize`

2. **Sheet'i "Results" olarak yeniden adlandırın** (sol alt köşedeki "Sheet1" sekmesine sağ tıklayın)

3. **Paylaşım ayarları**:
   - Sağ üst köşedeki "Paylaş" butonuna tıklayın
   - "Herkes bu bağlantıya sahip olanlar düzenleyebilir" seçin
   - **Bu ayar önemli!** API'nin yazabilmesi için gerekli

### 1.3 Google Sheets API Key Alma

1. [Google Cloud Console](https://console.cloud.google.com) adresine gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. **APIs & Services > Library** bölümüne gidin
4. "Google Sheets API" arayın ve etkinleştirin
5. **APIs & Services > Credentials** bölümüne gidin
6. **"+ CREATE CREDENTIALS" > "API key"** seçin
7. API key'i kopyalayın
8. **API key'i kısıtlayın** (opsiyonel ama önerilen):
   - API key'e tıklayın
   - "Application restrictions" altında "HTTP referrers" seçin
   - Cloudflare Pages domain'inizi ekleyin

## 🌐 Adım 2: Cloudflare Pages Kurulumu

### 2.1 Repository Bağlama

1. [Cloudflare Pages](https://pages.cloudflare.com) adresine gidin
2. "Create a project" tıklayın
3. Git provider'ınızı bağlayın (GitHub, GitLab, vb.)
4. Repository'nizi seçin
5. "Begin setup" tıklayın

### 2.2 Build Ayarları

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: / (boş bırakın)
```

### 2.3 Environment Variables

Cloudflare Pages dashboard'da şu environment variables'ları ekleyin:

```env
# Admin şifre hash'i (aşağıdaki komutla oluşturun)
ADMIN_PASSWORD_HASH=$2a$10$your.bcrypt.hash.here

# Google Sheets bilgileri
GOOGLE_SHEETS_ID=your_sheet_id_from_url
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key

# Domain (ilk deploy'dan sonra güncelleyin)
ALLOWED_ORIGIN=https://your-project-name.pages.dev
```

### 2.4 Admin Şifre Hash Oluşturma

Yerel terminal'de:

```bash
npm run generate-hash
# Veya manuel:
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

## 🚀 Adım 3: Deploy

1. "Save and Deploy" tıklayın
2. Build'in tamamlanmasını bekleyin
3. Pages URL'inizi not edin
4. Environment variables'da `ALLOWED_ORIGIN`'i güncelleyin
5. Gerekirse yeniden deploy edin

## 🧪 Adım 4: Test

### 4.1 Temel Test

1. Pages URL'inize gidin
2. Test verileri girin:
   - Ad: `Test User`
   - Telefon: `12345678901`
3. Çarkı çevirin
4. Sonucu kontrol edin

### 4.2 Google Sheets Kontrolü

1. Google Sheets'inizi açın
2. "Results" sayfasında yeni satırın eklendiğini kontrol edin
3. Verilerin doğru sütunlarda olduğunu doğrulayın

### 4.3 Admin Panel Testi

1. Sağ alt köşedeki dişli ikonuna tıklayın
2. Admin şifrenizi girin
3. Çark ayarlarını değiştirin
4. Kaydedin ve çarkın güncellendiğini kontrol edin

## ⚙️ Adım 5: Ayarlar

### 5.1 Çark Ayarları

- **Geliştirme modunda**: Ayarlar localStorage'da kalır
- **Production'da**: Ayarlar tarayıcı belleğinde saklanır
- **Sayfa yenilendiğinde**: Ayarlar korunur
- **Cache temizlendiğinde**: Ayarlar sıfırlanır (önemli değil)

### 5.2 Varsayılan Ayarlar

Uygulama ilk açıldığında şu varsayılan ödüller yüklenir:
- Ücretsiz Kahve
- %50 İndirim  
- Ücretsiz Tatlı
- Tekrar Dene (2x ağırlık)
- Ücretsiz Meze
- %25 İndirim
- Ücretsiz İçecek
- Şanslı Çekiliş

## 🔧 Sorun Giderme

### Yaygın Sorunlar

**"Google Sheets API error"**
- Sheet ID'nin doğru olduğunu kontrol edin
- API key'in aktif olduğunu doğrulayın
- Sheet'in "Herkes düzenleyebilir" olarak paylaşıldığını kontrol edin

**"Phone number already exists"**
- Google Sheets'te aynı telefon numarası var
- Bu normal bir durum, kullanıcı zaten katılmış

**Admin panel açılmıyor**
- `ADMIN_PASSWORD_HASH`'in doğru oluşturulduğunu kontrol edin
- Şifrenin doğru girildiğini doğrulayın

**Çark ayarları kayboluyor**
- localStorage'ın tarayıcıda aktif olduğunu kontrol edin
- Gizli/incognito modda çalışmaz

### Debug Modu

Environment variables'a ekleyin:
```env
DEBUG=true
```

## 📊 Google Sheets Yapısı

### Results Sayfası
| A (Timestamp) | B (FullName) | C (Phone) | D (Prize) |
|---------------|--------------|-----------|-----------|
| 2024-01-01T10:00:00Z | John Doe | 1234567890 | Ücretsiz Kahve |

### API Limitleri
- **Google Sheets API**: Günde 100 istek (ücretsiz)
- **Cloudflare Pages**: Ayda 100,000 istek (ücretsiz)
- **Yüksek trafik için**: Google Cloud Console'da quota artırın

## 🔄 Güncellemeler

### Uygulama Güncelleme
1. Kod değişikliklerini yapın
2. Git'e push edin
3. Cloudflare Pages otomatik deploy eder

### Ayarlar Güncelleme
- Admin panelden yapılır
- localStorage'da saklanır
- Tüm kullanıcılar için geçerli

## 📞 Destek

Sorun yaşarsanız:
1. Cloudflare Pages function logs'ları kontrol edin
2. Browser console'da hata mesajlarını inceleyin
3. Google Sheets API quota'nızı kontrol edin
4. Environment variables'ların doğru olduğunu doğrulayın

---
