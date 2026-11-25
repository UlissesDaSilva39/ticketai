-- ============================================================
--  promoter_messages
--  Mirror of artist_messages, keyed by promoter_id (uuid)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.promoter_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promoter_id  uuid NOT NULL,
  name         text NOT NULL,
  email        text NOT NULL,
  message      text NOT NULL,
  read_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS promoter_messages_promoter_idx
  ON public.promoter_messages (promoter_id, created_at DESC);

CREATE INDEX IF NOT EXISTS promoter_messages_unread_idx
  ON public.promoter_messages (promoter_id)
  WHERE read_at IS NULL;