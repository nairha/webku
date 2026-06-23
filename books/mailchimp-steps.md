# Cara Mengaktifkan Fitur Subscribe Email

1. **Pastikan komponen Mailchimp aktif**  
   - `src/components/Mailchimp.tsx` hanya menampilkan blok subscribe kalau `newsletter.display` bernilai `true`. Jika komponennya tidak muncul di UI, periksa `newsletter` di `src/resources/content.tsx` (bagian `getIdContent`) dan pastikan `display: true`.

2. **Tulis teks dan bahasa yang sesuai**  
   - Ubah judul/deskripsi subscribe di `src/resources/content.tsx:57-67` agar pesan sesuai dengan gaya Anda. Ini juga akan menyesuaikan teks yang muncul di komponen `Mailchimp`.

3. **Buat akun dan embed form Mailchimp**  
   - Di panel Mailchimp, buat audience/list baru dan generate “Embed form” seperti dijelaskan di `src/content/blog/backups/mailchimp.mdx`. Salin URL/`action` form tersebut untuk konfigurasi berikutnya.

4. **Setel form action dan efek visual**  
   - Buka `src/resources/once-ui.config.ts:117-166`. Ganti nilai `mailchimp.action` dengan URL POST Mailchimp hasil embed form Anda.  
   - Jika ingin mengubah latar, sesuaikan sub-objek `effects` (gradient, dots, grid, lines, mask) agar warna dan perilaku cocok dengan desain situs.

5. **Uji di browser**  
   - Jalankan `npm run dev` lalu buka halaman yang memuat `Mailchimp`. Isi email dan cek apakah form mengarah ke `mailchimp.action`. Jika tidak, verifikasi kembali `newsletter.display`, `action`, dan tidak ada error validasi email.

6. **Backup panduan lengkap**  
   - Referensi lengkap langkah-langkah Mailchimp (akun, embed, efek) ada di `src/content/blog/backups/mailchimp.mdx`. Gunakan file ini sebagai checklist jika butuh konteks tambahan atau ingin menyesuaikan dokumentasi internal.
