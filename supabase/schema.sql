/**
 * Esquema de Base de Datos para Supabase (PostgreSQL)
 * 
 * Instrucciones:
 * 1. Entra a tu proyecto en Supabase (https://supabase.com/dashboard)
 * 2. Ve a la sección 'SQL Editor' en el menú lateral
 * 3. Copia y pega todo este código y dale a 'RUN'
 */

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Cuentas Conectadas (YouTube, TikTok, etc.)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL, -- 'youtube' | 'tiktok' | 'instagram' | 'twitch'
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  channel_id VARCHAR(255) NOT NULL UNIQUE,
  badge VARCHAR(100),
  color VARCHAR(20) DEFAULT '#3B82F6',
  status VARCHAR(50) DEFAULT 'connected', -- 'connected' | 'error' | 'syncing'
  
  -- Credenciales y Tokens (Cifrados o tokens de OAuth)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  session_cookies TEXT, -- Para extractor de TikTok alternativo
  
  -- Métricas en caché de última sincronización
  subscribers BIGINT DEFAULT 0,
  subscribers_change_24h INT DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  views_24h INT DEFAULT 0,
  total_videos INT DEFAULT 0,
  avg_engagement_rate NUMERIC(5, 2) DEFAULT 0.0,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Métricas Diarias Históricas
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL,
  views INT DEFAULT 0,
  followers_gained INT DEFAULT 0,
  total_followers BIGINT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  engagement_rate NUMERIC(5, 2) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, recorded_date)
);

-- 3. Tabla de Contenido Reciente (Videos / Shorts / TikToks)
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  video_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  views BIGINT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  duration VARCHAR(20),
  type VARCHAR(50) DEFAULT 'video', -- 'video' | 'short' | 'tiktok'
  performance_tag VARCHAR(50) DEFAULT 'promedio',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, video_id)
);

-- 4. Registro de Sincronizaciones (Logs)
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL, -- 'success' | 'failed'
  message TEXT,
  items_synced INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_daily_metrics_account_date ON daily_metrics(account_id, recorded_date);
CREATE INDEX IF NOT EXISTS idx_content_account_pub ON content_items(account_id, published_at DESC);
