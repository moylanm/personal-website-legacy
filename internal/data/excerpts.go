package data

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"mylesmoylan.net/internal/validator"
)

type Excerpt struct {
	ID	      int64	 	`json:"-"`
	CreatedAt time.Time `json:"-"`
	Author	  string    `json:"author"`
	Work	  string    `json:"work"`
	Text	  string    `json:"text"`
}

type ExcerptModel struct {
	DB *sql.DB
}

func ValidateExcerpt(v *validator.Validator, excerpt *Excerpt) {
	v.Check(excerpt.Author != "", "author", "must be provided")
	
	v.Check(excerpt.Work != "", "work", "must be provided")

	v.Check(excerpt.Text != "", "text", "must be provided")
}

func (e ExcerptModel) Insert(excerpt *Excerpt) error {
	query := `
		INSERT INTO excerpts (author, work, text)
		VALUES ($1, $2, $3)`

	args := []any{excerpt.Author, excerpt.Work, excerpt.Text}

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
		SELECT id, created_at, author, work, text
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
		SET author = $1, work = $2, text = $3
		WHERE id = $4`

	args := []any{excerpt.Author, excerpt.Work, excerpt.Text, excerpt.ID}

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
