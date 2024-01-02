package main

import (
	"errors"
	"net/http"

	"mylesmoylan.net/internal/data"
	"mylesmoylan.net/internal/validator"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	excerpts, err := app.models.Excerpts.Latest(10)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	data := app.newTemplateData()
	data.Excerpts = excerpts

	app.render(w, r, http.StatusOK, "home.tmpl", data)
}

func (app *application) about(w http.ResponseWriter, r *http.Request) {
	data := app.newTemplateData()
	app.render(w, r, http.StatusOK, "about.tmpl", data)
}

func (app *application) createExcerpt(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Author string
		Work   string
		Body   string
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

	err = app.writeJSON(w, http.StatusCreated, envelope{"message": "excerpt successfully created"})
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showExcerpt(w http.ResponseWriter, r *http.Request) {
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

	data := app.newTemplateData()
	data.Excerpt = *excerpt

	app.render(w, r, http.StatusOK, "view.tmpl", data)
}

func (app *application) updateExcerpt(w http.ResponseWriter, r *http.Request) {
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
		ID     *int64  `json:"id"`
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

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "excerpt successfully updated"})
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteExcerpt(w http.ResponseWriter, r *http.Request) {
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

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "excerpt successfully deleted"})
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listExcerpts(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Author string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Author = app.readString(qs, "author", "")
	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)
	input.Filters.Sort = app.readString(qs, "sort", "-id")
	input.Filters.SortSafeList = []string{"id", "-id"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	excerpts, metadata, err := app.models.Excerpts.GetAllFiltered(input.Author, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	data := app.newTemplateData()
	data.Excerpts = excerpts
	data.Metadata = metadata

	app.render(w, r, http.StatusOK, "excerpts.tmpl", data)
}

func (app *application) listExcerptsJson(w http.ResponseWriter, r *http.Request) {
	excerpts, err := app.models.Excerpts.GetAll()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"excerpts": excerpts})
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
