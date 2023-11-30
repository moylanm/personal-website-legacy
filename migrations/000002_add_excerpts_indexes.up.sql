CREATE INDEX IF NOT EXISTS excerpts_author_idx ON excerpts USING GIN (to_tsvector('simple', author));
CREATE INDEX IF NOT EXISTS excerpts_tags_idx ON movies USING GIN (tags);
