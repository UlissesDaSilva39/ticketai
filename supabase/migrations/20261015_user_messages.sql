CREATE TABLE IF NOT EXISTS public.user_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  sender_name  text NOT NULL,
  sender_email text NOT NULL,
  message      text NOT NULL,
  read_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_messages_recipient_idx
  ON public.user_messages (recipient_id, created_at DESC);

ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_messages: anyone can insert" ON public.user_messages;
CREATE POLICY "user_messages: anyone can insert"
  ON public.user_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "user_messages: recipient can read own" ON public.user_messages;
CREATE POLICY "user_messages: recipient can read own"
  ON public.user_messages FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());