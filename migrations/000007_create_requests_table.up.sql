CREATE TABLE IF NOT EXISTS requests (
	id bigserial PRIMARY KEY,
	method text NOT NULL,
	path text NOT NULL,
	ip_address text NOT NULL,
	referer text NOT NULL,
	ua_name text NOT NULL,
	ua_os text NOT NULL,
	ua_device_type text NOT NULL,
	ua_device_name text NOT NULL,
	timestamp timestamp with time zone NOT NULL DEFAULT NOW()
);
