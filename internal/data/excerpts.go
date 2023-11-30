package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/lib/pq"
	"mylesmoylan.net/internal/validator"
)

type Excerpt struct {
	ID        int64     `json:"-"`
	CreatedAt time.Time `json:"-"`
	Author    string    `json:"author"`
	Work      string    `json:"work"`
	Text      string    `json:"text"`
	Tags      []string  `json:"tags,omitempty"`
}

type ExcerptModel struct {
	DB *sql.DB
}

func ValidateExcerpt(v *validator.Validator, excerpt *Excerpt) {
	v.Check(excerpt.Author != "", "author", "must be provided")

	v.Check(excerpt.Work != "", "work", "must be provided")

	v.Check(excerpt.Text != "", "text", "must be provided")

	v.Check(validator.Unique(excerpt.Tags), "tags", "must not contain duplicate values")
}

func (e ExcerptModel) Insert(excerpt *Excerpt) error {
	query := `
		INSERT INTO excerpts (author, work, text, tags)
		VALUES ($1, $2, $3, $4)`

	args := []any{excerpt.Author, excerpt.Work, excerpt.Text, pq.Array(excerpt.Tags)}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := e.DB.ExecContext(ctx, query, args...)

	return err
}

func (e ExcerptModel) Get(id int64) (*Excerpt, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT id, created_at, author, work, text, tags
		FROM excerpts
		WHERE id = $1`

	var excerpt Excerpt

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := e.DB.QueryRowContext(ctx, query, id).Scan(
		&excerpt.ID,
		&excerpt.CreatedAt,
		&excerpt.Author,
		&excerpt.Work,
		&excerpt.Text,
		pq.Array(&excerpt.Tags),
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &excerpt, nil
}

func (e ExcerptModel) Update(excerpt *Excerpt) error {
	query := `
		UPDATE excerpts
		SET author = $1, work = $2, text = $3, tags = $4
		WHERE id = $5`

	args := []any{excerpt.Author, excerpt.Work, excerpt.Text, pq.Array(excerpt.Tags), excerpt.ID}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := e.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrEditConflict
		default:
			return err
		}
	}

	return nil
}

func (e ExcerptModel) Delete(id int64) error {
	if id < 1 {
		return ErrRecordNotFound
	}

	query := `
		DELETE FROM excerpts
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := e.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}

func (e ExcerptModel) GetAll(author string, tags []string, filters Filters) ([]*Excerpt, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), id, created_at, author, work, text, tags
		FROM excerpts
		WHERE (to_tsvector('simple', author) @@ plainto_tsquery('simple', $1) OR $1 = '')
		AND (tags @> $2 OR $2 = '{}')
		ORDER BY %s %s, id ASC
		LIMIT $3 OFFSET $4`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []any{author, pq.Array(tags), filters.limit(), filters.offset()}

	rows, err := e.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	excerpts := []*Excerpt{}

	for rows.Next() {
		var excerpt Excerpt

		err := rows.Scan(
			&totalRecords,
			&excerpt.ID,
			&excerpt.CreatedAt,
			&excerpt.Author,
			&excerpt.Work,
			&excerpt.Text,
			pq.Array(&excerpt.Tags),
		)
		if err != nil {
			return nil, Metadata{}, err
		}

		excerpts = append(excerpts, &excerpt)
	}

	if err = rows.Err(); err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return excerpts, metadata, nil
}
