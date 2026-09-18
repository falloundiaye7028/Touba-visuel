CREATE TABLE IF NOT EXISTS kiiraay_records (
 id uuid PRIMARY KEY, kind text NOT NULL CHECK (kind IN ('articles','activities','cells','members','contributions')),
 data jsonb NOT NULL, created timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kiiraay_records_kind ON kiiraay_records(kind);
CREATE TABLE IF NOT EXISTS kiiraay_sessions (token_hash text PRIMARY KEY,expires timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS kiiraay_login_limits (bucket bigint PRIMARY KEY, attempts integer NOT NULL DEFAULT 0);
