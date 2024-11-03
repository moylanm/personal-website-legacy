package main

import (
	"errors"
	"net/http"

	"mylesmoylan.net/internal/data"
	"mylesmoylan.net/internal/validator"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	data := app.newTemplateData(r)

	app.render(w, r, http.StatusOK, "root.tmpl", data)
}

func (app *application) createExcerpt(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	excerpt := &data.Excerpt{
		Author: r.FormValue("author"),
		Work:   r.FormValue("work"),
		Body:   r.FormValue("body"),
	}

	v := validator.New()

	if data.ValidateExcerpt(v, excerpt); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	id, err := app.models.Excerpts.Insert(excerpt)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	excerpt.ID = id

	err = app.writeJSON(w, http.StatusCreated, envelope{"excerpt": excerpt})
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
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

	r.ParseForm()

	if r.FormValue("author") != "" {
		excerpt.Author = r.FormValue("author")
	}
	if r.FormValue("work") != "" {
		excerpt.Work = r.FormValue("work")
	}
	if r.FormValue("body") != "" {
		excerpt.Body = r.FormValue("body")
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

	err = app.writeJSON(w, http.StatusOK, envelope{"excerpt": excerpt})
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

	err = app.writeJSON(w, http.StatusOK, envelope{"id": id})
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
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
