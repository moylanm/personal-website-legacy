package data

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("record not found")
)

type Models struct {
	Excerpts ExcerptModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Excerpts: ExcerptModel{DB: db},
	}
}
