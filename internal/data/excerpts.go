package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"mylesmoylan.net/internal/validator"
)

type Excerpt struct {
	ID        int64     `json:"id,omitempty"`
	CreatedAt time.Time `json:"-"`
	Author    string    `json:"author,omitempty"`
	Work      string    `json:"work,omitempty"`
	Body      string    `json:"body,omitempty"`
}

type ExcerptModel struct {
	DB *sql.DB
}

func ValidateExcerpt(v *validator.Validator, excerpt *Excerpt) {
	v.Check(excerpt.Author != "", "author", "must be provided")

	v.Check(excerpt.Work != "", "work", "must be provided")

	v.Check(excerpt.Body != "", "body", "must be provided")
}

func (e ExcerptModel) Insert(excerpt *Excerpt) error {
	query := `
		INSERT INTO excerpts (author, work, body)
		VALUES ($1, $2, $3)`

	args := []any{excerpt.Author, excerpt.Work, excerpt.Body}

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
		SELECT id, created_at, author, work, body
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
		&excerpt.Body,
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
		SET author = $1, work = $2, body = $3
		WHERE id = $4`

	args := []any{excerpt.Author, excerpt.Work, excerpt.Body, excerpt.ID}

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

func (e ExcerptModel) GetAll() ([]Excerpt, error) {
	query := `
		SELECT id, author, work, body
		FROM excerpts
		ORDER BY id DESC`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := e.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	excerpts := []Excerpt{}

	for rows.Next() {
		var excerpt Excerpt

		err := rows.Scan(
			&excerpt.ID,
			&excerpt.Author,
			&excerpt.Work,
			&excerpt.Body,
		)
		if err != nil {
			return nil, err
		}

		excerpts = append(excerpts, excerpt)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return excerpts, nil
}

func (e *ExcerptModel) Latest(limit int) ([]Excerpt, error) {
	query := `
		SELECT id, author, work, created_at
		FROM excerpts
		ORDER BY id DESC LIMIT $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := e.DB.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var excerpts []Excerpt

	for rows.Next() {
		var e Excerpt

		err = rows.Scan(&e.ID, &e.Author, &e.Work, &e.CreatedAt)
		if err != nil {
			return nil, err
		}

		excerpts = append(excerpts, e)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return excerpts, nil
}

func (e ExcerptModel) GetAllFiltered(author string, filters Filters) ([]Excerpt, Metadata, error) {
	totalRecords, excerpts, err := e.getFiltered(author, filters)
	if err != nil {
		return nil, Metadata{}, err
	}

	if totalRecords == 0 {
		filters.Page = 1
		totalRecords, excerpts, err = e.getFiltered(author, filters)
		if err != nil {
			return nil, Metadata{}, err
		}
	}

	uniqueAuthors, err := e.getUniqueAuthors()
	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize, author, uniqueAuthors, filters)

	return excerpts, metadata, nil
}

func (e *ExcerptModel) getFiltered(author string, filters Filters) (int, []Excerpt, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), id, created_at, author, work, body
		FROM excerpts
		WHERE (to_tsvector('simple', author) @@ plainto_tsquery('simple', $1) OR $1 = '')
		ORDER BY %s %s, id ASC
		LIMIT $2 OFFSET $3`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []any{author, filters.limit(), filters.offset()}

	rows, err := e.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return 0, nil, err
	}
	defer rows.Close()

	totalRecords := 0
	excerpts := []Excerpt{}

	for rows.Next() {
		var excerpt Excerpt

		err := rows.Scan(
			&totalRecords,
			&excerpt.ID,
			&excerpt.CreatedAt,
			&excerpt.Author,
			&excerpt.Work,
			&excerpt.Body,
		)
		if err != nil {
			return 0, nil, err
		}

		excerpts = append(excerpts, excerpt)
	}

	if err = rows.Err(); err != nil {
		return 0, nil, err
	}

	return totalRecords, excerpts, nil
}

func (e *ExcerptModel) getUniqueAuthors() ([]string, error) {
	query := `
		SELECT DISTINCT author
		FROM excerpts`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := e.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var uniqueAuthors []string

	for rows.Next() {
		var author string

		err := rows.Scan(&author)
		if err != nil {
			return nil, err
		}

		uniqueAuthors = append(uniqueAuthors, author)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return uniqueAuthors, nil
}
