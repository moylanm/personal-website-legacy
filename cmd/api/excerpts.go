package main

import (
	"errors"
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

	err = app.writeJSON(w, http.StatusCreated, envelope{"message": "excerpt successfully created"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showExcerptHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	excerpt, err := app.models.Excerpts.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"excerpt": excerpt}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateExcerptHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	excerpt, err := app.models.Excerpts.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Author *string `json:"author"`
		Work   *string `json:"work"`
		Text   *string `json:"text"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Author != nil {
		excerpt.Author = *input.Author
	}
	if input.Work != nil {
		excerpt.Work = *input.Work
	}
	if input.Text != nil {
		excerpt.Text = *input.Text
	}

	v := validator.New()

	if data.ValidateExcerpt(v, excerpt); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Excerpts.Update(excerpt)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "excerpt successfully updated"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteExcerptHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Excerpts.Delete(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "excerpt successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}