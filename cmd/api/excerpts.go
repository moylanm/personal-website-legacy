package main

import (
	"net/http"

	"mylesmoylan.net/internal/data"
	"mylesmoylan.net/internal/validator"
)

func (app *application) createExcerptHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Author string
		Work   string
		Text   string
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	excerpt := &data.Excerpt{
		Author: input.Author,
		Work:   input.Work,
		Text:   input.Text,
	}

	v := validator.New()

	if data.ValidateExcerpt(v, excerpt); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Excerpts.Insert(excerpt)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"excerpt": excerpt}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
