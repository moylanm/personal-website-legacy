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
		Body string
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	excerpt := &data.Excerpt{
		Author: input.Author,
		Work:   input.Work,
		Body:   input.Body,
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
		Body   *string `json:"body"`
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
	if input.Body != nil {
		excerpt.Body = *input.Body
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

func (app *application) listExcerptsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Author string
		Tags   []string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Author = app.readString(qs, "author", "")
	input.Tags = app.readCSV(qs, "tags", []string{})
	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)
	input.Filters.Sort = app.readString(qs, "sort", "id")
	input.Filters.SortSafeList = []string{"id", "author", "work", "-id", "-author", "-work"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	excerpts, metadata, err := app.models.Excerpts.GetAll(input.Author, input.Tags, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"excerpts": excerpts, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
