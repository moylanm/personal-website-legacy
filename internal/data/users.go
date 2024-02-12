package data

import (
	"context"
	"database/sql"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type UserModel struct {
	DB *sql.DB
}

func (m *UserModel) Insert(name, email, password string) error {
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return err
	}

	query := `
		INSERT INTO users (name, email, password_hash)
		VALUES ($1, $2, $3)`

	args := []any{name, email, passwordHash}

	ctx, cancel := context.WithTimeout(context.Background(), queryTimeout)
	defer cancel()

	_, err = m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
			return ErrDuplicateEmail
		default:
			return err
		}
	}

	return nil
}

func (m *UserModel) Authetnicate(email, password string) (int, error) {
	var id int
	var passwordHash []byte

	query := "SELECT id, password_hash FROM users WHERE email = $1"

	ctx, cancel := context.WithTimeout(context.Background(), queryTimeout)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, email).Scan(&id, &passwordHash)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return 0, ErrInvalidCredentials
		default:
			return 0, err
		}
	}

	err = bcrypt.CompareHashAndPassword(passwordHash, []byte(password))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return 0, ErrInvalidCredentials
		default:
			return 0, err
		}
	}

	return id, nil
}

func (m *UserModel) Exists(id int) (bool, error) {
	var exists bool

	query := "SELECT EXISTS(SELECT true FROM users WHERE id = $1)"

	ctx, cancel := context.WithTimeout(context.Background(), queryTimeout)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, id).Scan(&exists)
	return exists, err
}
