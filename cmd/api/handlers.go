package main

import (
	"errors"
	"net/http"

	"mylesmoylan.net/internal/data"
	"mylesmoylan.net/internal/validator"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	excerpts, err := app.models.Excerpts.Latest(7)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	data := app.newTemplateData(r)
	data.Excerpts = excerpts

	app.render(w, r, http.StatusOK, "home.tmpl", data)
}

func (app *application) about(w http.ResponseWriter, r *http.Request) {
	data := app.newTemplateData(r)
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

	data := app.newTemplateData(r)
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

	data := app.newTemplateData(r)
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

func (app *application) dashboard(w http.ResponseWriter, r *http.Request) {
	data := app.newTemplateData(r)
	app.render(w, r, http.StatusOK, "dashboard.tmpl", data)
}

func (app *application) requestLogsJson(w http.ResponseWriter, r *http.Request) {
	requests, err := app.models.Requests.GetAll()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"requests": requests})
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) clearRequestLogs(w http.ResponseWriter, r *http.Request) {
	err := app.models.Requests.Clear()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "requests logs successfully deleted"})
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

type userLoginForm struct {
	Email    string
	Password string
	validator.Validator
}

func (app *application) userLogin(w http.ResponseWriter, r *http.Request) {
	data := app.newTemplateData(r)

	if data.IsAuthenticated {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	data.Form = userLoginForm{}
	app.render(w, r, http.StatusOK, "login.tmpl", data)
}

func (app *application) userLoginPost(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	form := userLoginForm{
		Email:     r.PostForm.Get("email"),
		Password:  r.PostForm.Get("password"),
		Validator: *validator.New(),
	}

	form.Check(validator.NotBlank(form.Email), "email", "This field cannot be blank")
	form.Check(validator.Matches(form.Email, validator.EmailRX), "email", "This field must be a valid email address")
	form.Check(validator.NotBlank(form.Password), "password", "This field cannot be blank")

	if !form.Valid() {
		data := app.newTemplateData(r)
		data.Form = form
		app.render(w, r, http.StatusUnprocessableEntity, "login.tmpl", data)
		return
	}

	id, err := app.models.Users.Authenticate(form.Email, form.Password)
	if err != nil {
		if errors.Is(err, data.ErrInvalidCredentials) {
			form.AddNonFieldError("Email or password is incorrect")

			data := app.newTemplateData(r)
			data.Form = form
			app.render(w, r, http.StatusUnprocessableEntity, "login.tmpl", data)
		} else {
			app.serverErrorResponse(w, r, err)
		}

		return
	}

	err = app.sessionManager.RenewToken(r.Context())
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.sessionManager.Put(r.Context(), "authenticatedUserID", id)

	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
}

func (app *application) userLogoutPost(w http.ResponseWriter, r *http.Request) {
	err := app.sessionManager.RenewToken(r.Context())
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.sessionManager.Remove(r.Context(), "authenticatedUserID")

	app.sessionManager.Put(r.Context(), "flash", "You've been logged out successfully!")

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
