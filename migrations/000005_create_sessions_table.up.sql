CREATE TABLE IF NOT EXISTS sessions (
	token char(43) PRIMARY KEY,
	data bytea NOT NULL,
	expiry timestamp(6) NOT NULL
);

CREATE INDEX sessions_expiry_idx ON sessions (expiry);
