# 🔄 Cara Update Daftar Teman dari Database

Setelah approve friend requests di Supabase, ikuti langkah ini untuk menampilkan mereka di website.

---

## Langkah 1: Export Approved Friends dari Supabase

Jalankan query ini di Supabase SQL Editor:

```sql
SELECT 
    name,
    COALESCE(nickname, name) as nickname,
    COALESCE(description, 'No description') as motto,
    url as website,
    avatar,
    'Nuxt' as stack  -- Sesuaikan dengan tech stack mereka
FROM friend_requests 
WHERE status = 'approved'
ORDER BY created_at DESC;
```

---

## Langkah 2: Format ke JavaScript Object

Hasil query di atas, convert ke format ini:

```javascript
{ 
  name: "Nama Website", 
  motto: "Motto atau deskripsi", 
  avatar: "https://...", 
  website: "https://...", 
  stack: ["Nuxt"] // atau ["React"], ["Vue"], dll
}
```

---

## Langkah 3: Update File Content

### Untuk Bahasa Indonesia (`src/resources/content.tsx`)

Edit bagian `teman.friends`:

```typescript
const getIdContent = (person: Person, lang: string) => {
  // ... kode lainnya ...
  
  const teman: Friends = {
    // ... kode lainnya ...
    friends: {
      online: [
        { name: "Nairha", motto: "我來過，我見過，我掌握了", avatar: "https://avatars.githubusercontent.com/u/204519754?s=130&v=4", website: "https://nairha.nlfts.dev", stack: ["Angular"] },
        // TAMBAHKAN APPROVED FRIENDS DI SINI
        { name: "New Friend", motto: "Their motto", avatar: "https://...", website: "https://...", stack: ["Nuxt"] },
      ],
      aktif: [
        { name: "Vahllzzzz", motto: "Life Is But A Dream.", avatar: "https://avatars.githubusercontent.com/u/202130049?s=130&v=4", website: "https://vahllzzzz.nlfts.dev", stack: ["Nuxt"] },
        // ... existing friends ...
        // ATAU TAMBAHKAN DI SINI
      ],
      pena: [
        // ATAU DI SINI untuk pen pals
      ],
    },
  };
  
  return { newsletter, home, about, blog, work, gallery, sponsor, speaking, teman, experimen };
};
```

### Untuk Bahasa English (`src/resources/locales/en.tsx`)

Update bagian yang sama di `getCnContent`:

```typescript
const teman: Friends = {
  // ... kode lainnya ...
  friends: {
    online: [
      { name: "Nairha", motto: "I came, I saw, I conquered", avatar: "https://...", website: "https://...", stack: ["Angular"] },
      // TAMBAHKAN APPROVED FRIENDS DI SINI
    ],
    aktif: [
      // ... existing friends ...
    ],
    pena: [],
  },
};
```

### Untuk Bahasa Chinese (`src/resources/locales/cn.tsx`)

Update bagian yang sama di `getEnContent`:

```typescript
const teman: Friends = {
  // ... kode lainnya ...
  friends: {
    online: [
      { name: "Nairha", motto: "我來過，我見過，我掌握了", avatar: "https://...", website: "https://...", stack: ["Angular"] },
      // TAMBAHKAN APPROVED FRIENDS DI SINI
    ],
    aktif: [
      // ... existing friends ...
    ],
    pena: [],
  },
};
```

---

## Langkah 4: Pilih Kategori yang Tepat

- **online**: Teman online / digital connections
- **aktif**: Teman aktif / core circle
- **pena**: Pen pals / teman korespondensi

---

## Langkah 5: Sesuaikan Tech Stack Icon

Available stack icons (lihat di `src/app/[lang]/teman/page.tsx`):

```typescript
const stackIcons = {
  "Nuxt": "nuxt",
  "Angular": "angular",
  "Laravel": "laravel",
  "React": "reactapi",
  "Vue": "vue",
  "Next": "nextjs",
  "Svelte": "svelte"
};
```

Jika tech stack tidak ada di list, tambahkan di object `stackIcons` atau gunakan yang paling mendekati.

---

## Contoh Lengkap

Misalnya ada 2 approved requests:

**Request 1:**
- Name: "Ray's Blog"
- Nickname: "Ray"
- Description: "Never say never."
- URL: "https://mk1.io"
- Avatar: "https://img.mk1.io/img/avatar.png"
- Tech: Next.js

**Request 2:**
- Name: "Dev Journey"
- Nickname: "Alex"
- Description: "Learning in public"
- URL: "https://alexdev.com"
- Avatar: "https://alexdev.com/avatar.jpg"
- Tech: Vue

### Update ke content.tsx:

```typescript
friends: {
  online: [
    { name: "Nairha", motto: "我來過，我見過，我掌握了", avatar: "https://avatars.githubusercontent.com/u/204519754?s=130&v=4", website: "https://nairha.nlfts.dev", stack: ["Angular"] },
    { name: "Ray's Blog", motto: "Never say never.", avatar: "https://img.mk1.io/img/avatar.png", website: "https://mk1.io", stack: ["Next"] },
    { name: "Dev Journey", motto: "Learning in public", avatar: "https://alexdev.com/avatar.jpg", website: "https://alexdev.com", stack: ["Vue"] },
  ],
  aktif: [
    // ... existing ...
  ],
  pena: [],
},
```

---

## Langkah 6: Test

1. Save file
2. Refresh browser
3. Buka `/id/teman` atau `/en/teman` atau `/cn/teman`
4. Scroll ke section friends
5. Pastikan card baru muncul dengan benar

---

## Automation (Opsional)

Untuk auto-sync dari database ke website, bisa buat:

### Option 1: API Endpoint
```typescript
// src/app/api/friends/route.ts
export async function GET() {
  const approved = await fetch(`${SUPABASE_URL}/rest/v1/friend_requests?status=eq.approved`);
  return Response.json(await approved.json());
}
```

Lalu fetch di page component.

### Option 2: Build-time Generation
Buat script yang generate file TypeScript dari database saat build:

```javascript
// scripts/sync-friends.js
const fs = require('fs');

async function syncFriends() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/friend_requests?status=eq.approved`);
  const friends = await res.json();
  
  const code = `export const approvedFriends = ${JSON.stringify(friends, null, 2)};`;
  fs.writeFileSync('src/data/approved-friends.ts', code);
}

syncFriends();
```

Jalankan sebelum build:
```json
{
  "scripts": {
    "prebuild": "node scripts/sync-friends.js",
    "build": "next build"
  }
}
```

---

## Tips

1. **Backup dulu** sebelum edit `content.tsx`
2. **Cek URL** masih aktif sebelum add
3. **Compress avatar image** jika terlalu besar (gunakan TinyPNG)
4. **Konsisten format** motto (capitalize, punctuation)
5. **Group by category** yang masuk akal (online/aktif/pena)

---

Selamat mengelola friend links! 🎉
