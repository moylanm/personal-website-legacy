package data

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type Models struct {
	Excerpts ExcerptModel
	Users    UserModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Excerpts: ExcerptModel{DB: db},
		Users:    UserModel{DB: db},
	}
}
