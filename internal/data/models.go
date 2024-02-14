package data

import (
	"database/sql"
	"errors"
	"time"
)

var (
	ErrRecordNotFound     = errors.New("record not found")
	ErrEditConflict       = errors.New("edit conflict")
	ErrDuplicateEmail     = errors.New("duplicate email")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

const queryTimeout = 3 * time.Second

type Models struct {
	Excerpts ExcerptModel
	Users    UserModel
	Requests RequestModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Excerpts: ExcerptModel{DB: db},
		Users:    UserModel{DB: db},
		Requests: RequestModel{DB: db},
	}
}
