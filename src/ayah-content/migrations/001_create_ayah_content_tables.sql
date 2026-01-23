-- Create ayah_groups table
CREATE TABLE IF NOT EXISTS ayah_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surah_id INTEGER NOT NULL,
    start_ayah INTEGER NOT NULL,
    end_ayah INTEGER NOT NULL,
    is_grouped BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_ayah_range UNIQUE (surah_id, start_ayah, end_ayah)
);

-- Create indexes for ayah_groups
CREATE INDEX IF NOT EXISTS idx_ayah_groups_surah_id ON ayah_groups(surah_id);
CREATE INDEX IF NOT EXISTS idx_ayah_groups_is_grouped ON ayah_groups(is_grouped);
CREATE INDEX IF NOT EXISTS idx_ayah_groups_range ON ayah_groups(surah_id, start_ayah, end_ayah);

-- Create ayah_tafsir table
CREATE TABLE IF NOT EXISTS ayah_tafsir (
    id SERIAL PRIMARY KEY,
    ayah_group_id UUID NOT NULL REFERENCES ayah_groups(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    tafsir_text TEXT NOT NULL,
    scholar VARCHAR(255),
    source VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_tafsir_per_group UNIQUE (ayah_group_id, language_code, source)
);

-- Create indexes for ayah_tafsir
CREATE INDEX IF NOT EXISTS idx_ayah_tafsir_group_id ON ayah_tafsir(ayah_group_id);
CREATE INDEX IF NOT EXISTS idx_ayah_tafsir_language ON ayah_tafsir(language_code);
CREATE INDEX IF NOT EXISTS idx_ayah_tafsir_status ON ayah_tafsir(status);

-- Create ayah_translation table
CREATE TABLE IF NOT EXISTS ayah_translation (
    id SERIAL PRIMARY KEY,
    ayah_group_id UUID NOT NULL REFERENCES ayah_groups(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    translation_text TEXT NOT NULL,
    translator VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_translation_per_group UNIQUE (ayah_group_id, language_code, translator)
);

-- Create indexes for ayah_translation
CREATE INDEX IF NOT EXISTS idx_ayah_translation_group_id ON ayah_translation(ayah_group_id);
CREATE INDEX IF NOT EXISTS idx_ayah_translation_language ON ayah_translation(language_code);
CREATE INDEX IF NOT EXISTS idx_ayah_translation_status ON ayah_translation(status);

-- Create ayah_info table
CREATE TABLE IF NOT EXISTS ayah_info (
    id SERIAL PRIMARY KEY,
    ayah_group_id UUID NOT NULL REFERENCES ayah_groups(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    info_text TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_info_per_group UNIQUE (ayah_group_id, language_code)
);

-- Create indexes for ayah_info
CREATE INDEX IF NOT EXISTS idx_ayah_info_group_id ON ayah_info(ayah_group_id);
CREATE INDEX IF NOT EXISTS idx_ayah_info_language ON ayah_info(language_code);
CREATE INDEX IF NOT EXISTS idx_ayah_info_status ON ayah_info(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_ayah_groups_updated_at ON ayah_groups;
CREATE TRIGGER update_ayah_groups_updated_at BEFORE UPDATE ON ayah_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ayah_tafsir_updated_at ON ayah_tafsir;
CREATE TRIGGER update_ayah_tafsir_updated_at BEFORE UPDATE ON ayah_tafsir
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ayah_translation_updated_at ON ayah_translation;
CREATE TRIGGER update_ayah_translation_updated_at BEFORE UPDATE ON ayah_translation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ayah_info_updated_at ON ayah_info;
CREATE TRIGGER update_ayah_info_updated_at BEFORE UPDATE ON ayah_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
