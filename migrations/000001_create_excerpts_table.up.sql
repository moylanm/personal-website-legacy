CREATE TABLE IF NOT EXISTS excerpts (
	id bigserial PRIMARY KEY,
	created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
	author text NOT NULL,
	work text NOT NULL,
	body text NOT NULL,
	tags text[] NOT NULL
);
