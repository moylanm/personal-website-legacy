ALTER TABLE excerpts ADD CONSTRAINT tags_length_check CHECK (array_length(tags, 1) BETWEEN 1 AND 5);
