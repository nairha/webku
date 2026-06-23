# 📌 Implementasi Friend Link Request System

## ✅ Fitur yang Sudah Diimplementasikan

### 1. **Header Navigation Update**
- ✅ Menu "Berbicara" sekarang hanya menampilkan icon microphone (di desktop & mobile)
- ✅ Menu "Teman" ditambahkan dengan teks (desktop) dan icon people (mobile)
- ✅ Bahasa tetap konsisten di semua halaman (ID/CN/EN)

**File yang diubah:**
- `src/components/Header.tsx`

---

### 2. **Halaman Teman - Section Minta Pertemanan**
- ✅ Section baru ditambahkan di atas quote "Di Dunia ini tidak ada yang lebih Berarti dari pada Pertemanan"
- ✅ Menampilkan persyaratan lengkap dalam 5 kategori:
  - ✅ Syarat Utama
  - 🔗 Persyaratan Link
  - ⚖️ Penilaian
  - 🔄 Pemeliharaan
  - 📝 Catatan Tambahan
- ✅ Tombol hijau "Ajukan Pertemanan" dengan animasi hover
- ✅ Support 3 bahasa (ID/EN/CN)

**File yang diubah:**
- `src/app/[lang]/teman/page.tsx`

---

### 3. **Modal Form Friend Request**
- ✅ Modal popup dengan form input:
  - Name (wajib)
  - Nickname (opsional)
  - Description (opsional)
  - URL (wajib, validasi format)
  - Avatar URL (wajib, validasi format)
- ✅ Menampilkan info situs ini untuk di-copy
- ✅ Tombol copy info dengan feedback visual
- ✅ Validasi form client-side
- ✅ Loading state saat submit
- ✅ Success/error feedback
- ✅ Support 3 bahasa (ID/EN/CN)

**File yang dibuat:**
- `src/components/teman/FriendRequestModal.tsx`

---

### 4. **API Route dengan Rate Limiting**
- ✅ Endpoint: `POST /api/friend-request`
- ✅ Rate limiting: **2 submissions per device per month**
- ✅ Device fingerprinting menggunakan IP + User-Agent
- ✅ Validasi input (required fields, URL format)
- ✅ Error handling lengkap
- ✅ Response dengan pesan error yang informatif (termasuk tanggal reset)

**File yang dibuat:**
- `src/app/api/friend-request/route.ts`

---

### 5. **Database Schema (Supabase)**
- ✅ Tabel `friend_requests` dengan kolom:
  - `id` (UUID, primary key)
  - `name` (TEXT, required)
  - `nickname` (TEXT, optional)
  - `description` (TEXT, optional)
  - `url` (TEXT, required)
  - `avatar` (TEXT, required)
  - `device_id` (TEXT, required - untuk rate limiting)
  - `status` (TEXT, default 'pending' - untuk approval workflow)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP, auto-update)
- ✅ Indexes untuk performa query
- ✅ Row Level Security (RLS) policies
- ✅ Auto-update trigger untuk `updated_at`

**File yang dibuat:**
- `supabase-schema.sql`

---

## 🚀 Cara Setup

### 1. **Setup Supabase**

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka **SQL Editor**
4. Copy-paste isi file `supabase-schema.sql`
5. Klik **Run** untuk membuat tabel dan policies

### 2. **Update Environment Variables**

Edit file `.env` dan update `PROJECT_URL` dengan URL Supabase project Anda:

```env
PROJECT_URL=https://your-project-id.supabase.co
PUBLISH_KEY=your_supabase_anon_key
SECRET_KEY=your_supabase_service_role_key
```

**Cara mendapatkan URL dan Keys:**
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Klik **Settings** → **API**
4. Copy:
   - **Project URL** → `PROJECT_URL`
   - **anon public** key → `PUBLISH_KEY`
   - **service_role** key → `SECRET_KEY`

### 3. **Install Dependencies (jika belum)**

```bash
npm install
```

### 4. **Run Development Server**

```bash
npm run dev
```

### 5. **Test Fitur**

1. Buka `http://localhost:3000/id/teman`
2. Scroll ke bawah ke section "Minta Pertemanan"
3. Klik tombol hijau "Ajukan Pertemanan"
4. Isi form dan submit
5. Cek Supabase Dashboard → **Table Editor** → `friend_requests` untuk melihat data

---

## 📊 Query Database yang Berguna

### Melihat semua request
```sql
SELECT * FROM friend_requests 
ORDER BY created_at DESC;
```

### Melihat request pending
```sql
SELECT * FROM friend_requests 
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Melihat jumlah request per device bulan ini
```sql
SELECT device_id, COUNT(*) as count 
FROM friend_requests 
WHERE created_at >= date_trunc('month', NOW())
GROUP BY device_id
ORDER BY count DESC;
```

### Approve request
```sql
UPDATE friend_requests 
SET status = 'approved' 
WHERE id = 'uuid-here';
```

### Reject request
```sql
UPDATE friend_requests 
SET status = 'rejected' 
WHERE id = 'uuid-here';
```

---

## 🔒 Rate Limiting Logic

**Cara kerja:**
1. Setiap request, sistem membuat "device fingerprint" dari IP + User-Agent
2. Hash fingerprint menjadi device_id
3. Cek berapa kali device_id ini submit di bulan berjalan
4. Jika sudah 2x, tolak dengan error 429 dan tampilkan tanggal reset
5. Jika belum, izinkan submit

**Limitasi:**
- User bisa bypass dengan ganti browser/device/IP
- Tapi cukup efektif untuk mencegah spam otomatis
- Untuk proteksi lebih ketat, bisa tambahkan CAPTCHA atau auth

---

## 🎨 Customization

### Mengubah limit per bulan
Edit `src/app/api/friend-request/route.ts`:
```typescript
const MONTHLY_LIMIT = 2; // Ubah angka ini
```

### Mengubah info situs yang ditampilkan
Edit `src/components/teman/FriendRequestModal.tsx`:
```typescript
const SITE_INFO = {
  name: "Davin's Blog",
  nickname: "Davin",
  description: "Never say never.",
  url: "https://davingm.com",
  avatar: "https://davingm.com/images/author.jpg",
};
```

### Menambah/mengubah persyaratan
Edit `src/app/[lang]/teman/page.tsx` di bagian `RequirementSection` components.

---

## 🐛 Troubleshooting

### Error: "A param property was accessed directly with `params.lang`"
- **Penyebab:** Next.js 15+ mengubah `params` menjadi Promise
- **Solusi:** Sudah diperbaiki dengan menggunakan `React.use()` untuk unwrap Promise
- **File:** `src/app/[lang]/teman/page.tsx`

### Error: "Server not configured"
- Pastikan `.env` sudah diisi dengan benar
- Restart development server setelah update `.env`

### Error: "Failed to submit request"
- Cek Supabase Dashboard → **Table Editor** → pastikan tabel `friend_requests` sudah dibuat
- Cek **Authentication** → **Policies** → pastikan RLS policies sudah aktif
- Cek browser console untuk error detail

### Rate limit tidak bekerja
- Cek apakah `device_id` tersimpan di database
- Coba clear browser cache/cookies
- Coba dari browser/device berbeda

### Form tidak muncul
- Cek browser console untuk error
- Pastikan `FriendRequestModal` sudah di-import dengan benar
- Cek apakah `showModal` state berfungsi

---

## 📝 Next Steps (Opsional)

### 1. Admin Dashboard
Buat halaman admin untuk review request:
- List semua pending requests
- Approve/reject dengan 1 klik
- Edit friend data sebelum approve

### 2. Email Notification
Kirim email ke admin saat ada request baru:
- Gunakan Supabase Edge Functions
- Atau webhook ke service email (SendGrid, Resend, dll)

### 3. Auto-approve untuk domain tertentu
Tambah whitelist domain yang langsung approved:
```typescript
const TRUSTED_DOMAINS = ['github.io', 'vercel.app'];
```

### 4. CAPTCHA
Tambah Google reCAPTCHA atau Cloudflare Turnstile untuk proteksi spam lebih baik.

### 5. Analytics
Track berapa banyak request per hari/minggu/bulan dengan chart.

---

## ✨ Summary

Semua fitur yang diminta sudah diimplementasikan:
- ✅ Menu berbicara jadi icon mic saja
- ✅ Menu Teman ditambahkan dengan teks
- ✅ Bahasa konsisten (ID/CN/EN)
- ✅ Section Minta Pertemanan dengan persyaratan lengkap
- ✅ Tombol hijau dengan modal form
- ✅ Rate limiting 2x per device per bulan
- ✅ Submit ke Supabase
- ✅ Database schema lengkap

**Total files created/modified: 6 files**
- Modified: `src/components/Header.tsx`
- Modified: `src/app/[lang]/teman/page.tsx`
- Created: `src/components/teman/FriendRequestModal.tsx`
- Created: `src/app/api/friend-request/route.ts`
- Created: `supabase-schema.sql`
- Modified: `.env`

Selamat mencoba! 🎉
