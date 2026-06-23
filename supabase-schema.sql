-- Tabel untuk menyimpan permintaan friend link
-- Jalankan query ini di Supabase SQL Editor

CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    nickname TEXT,
    description TEXT,
    url TEXT NOT NULL,
    avatar TEXT NOT NULL,
    device_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk query yang sering digunakan
CREATE INDEX IF NOT EXISTS idx_friend_requests_device_id ON friend_requests(device_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_created_at ON friend_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);

-- Enable Row Level Security (RLS)
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (untuk submit form)
CREATE POLICY "Allow public insert" ON friend_requests
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy: Allow public to read (untuk admin dashboard nanti)
CREATE POLICY "Allow public read" ON friend_requests
    FOR SELECT
    TO public
    USING (true);

-- Policy: Only authenticated users can update/delete (untuk admin)
CREATE POLICY "Allow authenticated update" ON friend_requests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON friend_requests
    FOR DELETE
    TO authenticated
    USING (true);

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-update updated_at
CREATE TRIGGER update_friend_requests_updated_at
    BEFORE UPDATE ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Contoh query untuk melihat data
-- SELECT * FROM friend_requests ORDER BY created_at DESC;

-- Contoh query untuk melihat jumlah request per device bulan ini
-- SELECT device_id, COUNT(*) as count 
-- FROM friend_requests 
-- WHERE created_at >= date_trunc('month', NOW())
-- GROUP BY device_id
-- ORDER BY count DESC;
