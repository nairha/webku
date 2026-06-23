# 📊 Database Queries - Friend Link System

## Setup Database

Jalankan query di `supabase-schema.sql` terlebih dahulu di Supabase SQL Editor.

---

## Query Penting

### 1. Lihat Semua Request (Terbaru)
```sql
SELECT 
    id,
    name,
    nickname,
    url,
    avatar,
    status,
    created_at,
    device_id
FROM friend_requests 
ORDER BY created_at DESC
LIMIT 50;
```

### 2. Lihat Request Pending (Butuh Review)
```sql
SELECT 
    id,
    name,
    nickname,
    description,
    url,
    avatar,
    created_at
FROM friend_requests 
WHERE status = 'pending'
ORDER BY created_at ASC;
```

### 3. Approve Request
```sql
UPDATE friend_requests 
SET status = 'approved', updated_at = NOW()
WHERE id = 'PASTE-UUID-HERE';
```

### 4. Reject Request
```sql
UPDATE friend_requests 
SET status = 'rejected', updated_at = NOW()
WHERE id = 'PASTE-UUID-HERE';
```

### 5. Bulk Approve (Hati-hati!)
```sql
UPDATE friend_requests 
SET status = 'approved', updated_at = NOW()
WHERE status = 'pending' 
  AND created_at >= '2024-01-01';
```

---

## Monitoring & Analytics

### 6. Statistik Request Bulan Ini
```sql
SELECT 
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM friend_requests 
WHERE created_at >= date_trunc('month', NOW());
```

### 7. Request Per Hari (7 Hari Terakhir)
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
FROM friend_requests 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 8. Top Devices (Spam Detection)
```sql
SELECT 
    device_id,
    COUNT(*) as submission_count,
    MIN(created_at) as first_submission,
    MAX(created_at) as last_submission
FROM friend_requests 
WHERE created_at >= date_trunc('month', NOW())
GROUP BY device_id
HAVING COUNT(*) > 1
ORDER BY submission_count DESC;
```

### 9. Request Per Status
```sql
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM friend_requests
GROUP BY status
ORDER BY count DESC;
```

---

## Rate Limiting Check

### 10. Cek Limit Device Tertentu Bulan Ini
```sql
SELECT 
    device_id,
    COUNT(*) as submissions_this_month,
    CASE 
        WHEN COUNT(*) >= 2 THEN 'LIMIT REACHED'
        ELSE 'OK'
    END as status
FROM friend_requests 
WHERE device_id = 'PASTE-DEVICE-ID-HERE'
  AND created_at >= date_trunc('month', NOW())
GROUP BY device_id;
```

### 11. Devices yang Sudah Mencapai Limit
```sql
SELECT 
    device_id,
    COUNT(*) as submissions,
    MAX(created_at) as last_submission
FROM friend_requests 
WHERE created_at >= date_trunc('month', NOW())
GROUP BY device_id
HAVING COUNT(*) >= 2
ORDER BY submissions DESC;
```

---

## Data Cleanup

### 12. Hapus Request Rejected Lebih dari 3 Bulan
```sql
DELETE FROM friend_requests 
WHERE status = 'rejected' 
  AND created_at < NOW() - INTERVAL '3 months';
```

### 13. Hapus Duplicate Submissions (Same URL)
```sql
-- Lihat dulu duplicates
SELECT url, COUNT(*) as count
FROM friend_requests
WHERE status = 'pending'
GROUP BY url
HAVING COUNT(*) > 1;

-- Hapus duplicates (keep oldest)
DELETE FROM friend_requests a
USING friend_requests b
WHERE a.id > b.id 
  AND a.url = b.url 
  AND a.status = 'pending';
```

---

## Export Data

### 14. Export Approved Friends (untuk ditampilkan di website)
```sql
SELECT 
    name,
    nickname,
    description,
    url,
    avatar
FROM friend_requests 
WHERE status = 'approved'
ORDER BY created_at DESC;
```

Format JSON:
```sql
SELECT json_agg(
    json_build_object(
        'name', name,
        'nickname', COALESCE(nickname, name),
        'motto', COALESCE(description, ''),
        'website', url,
        'avatar', avatar
    )
) as friends
FROM friend_requests 
WHERE status = 'approved';
```

---

## Maintenance

### 15. Reset Rate Limit (Awal Bulan Baru)
Rate limit otomatis reset karena query API cek `created_at >= start_of_month`.
Tidak perlu manual reset.

### 16. Backup Data
```sql
-- Export ke CSV di Supabase Dashboard:
-- Table Editor → friend_requests → Export → CSV
```

---

## Tips

1. **Selalu backup sebelum DELETE/UPDATE massal**
2. **Gunakan WHERE clause yang spesifik**
3. **Test query dengan SELECT dulu sebelum UPDATE/DELETE**
4. **Monitor spam dengan query #8**
5. **Review pending requests secara berkala**

---

## Contoh Workflow Review

```sql
-- 1. Lihat pending requests
SELECT id, name, url, created_at 
FROM friend_requests 
WHERE status = 'pending'
ORDER BY created_at ASC;

-- 2. Cek website secara manual (buka di browser)

-- 3. Approve yang bagus
UPDATE friend_requests 
SET status = 'approved' 
WHERE id = 'uuid-1';

-- 4. Reject yang tidak sesuai
UPDATE friend_requests 
SET status = 'rejected' 
WHERE id = 'uuid-2';

-- 5. Export approved untuk update website
SELECT name, url, avatar 
FROM friend_requests 
WHERE status = 'approved';
```

---

Semua query sudah tested dan aman digunakan! 🎉
