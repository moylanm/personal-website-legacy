package main

import (
	"fmt"
	"net/http"
	"strings"
)

type httpError struct {
	StatusCode       int
	Message          string
	ValidationErrors map[string]string
}

func (e httpError) FormatValidationErrors() string {
	var sb strings.Builder

	for k, v := range e.ValidationErrors {
		sb.WriteString(fmt.Sprintf("%s: %s\n", k, v))
	}

	return sb.String()
}

func (app *application) logError(r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	app.logger.Error(err.Error(), "method", method, "uri", uri)
}

func (app *application) errorResponse(w http.ResponseWriter, r *http.Request, httpErr httpError) {
	status := httpErr.StatusCode

	if strings.HasPrefix(r.Header.Get("Accept"), "text/html") {
		data := app.newTemplateData(r)
		data.StatusCode = status

		if httpErr.ValidationErrors != nil {
			data.ErrorMessage = httpErr.FormatValidationErrors()
		} else {
			data.ErrorMessage = httpErr.Message
		}

		app.render(w, r, status, "error.tmpl", data)
	} else {
		var env envelope

		if httpErr.ValidationErrors != nil {
			env = envelope{"errors": httpErr.ValidationErrors}
		} else {
			env = envelope{"error": httpErr.Message}
		}

		err := app.writeJSON(w, status, env)
		if err != nil {
			app.logError(r, err)
			w.WriteHeader(500)
		}
	}
}

func (app *application) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logError(r, err)

	httpErr := httpError{
		StatusCode: http.StatusInternalServerError,
		Message:    "the server encountered a problem and could not process your request",
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := httpError{
		StatusCode: http.StatusNotFound,
		Message:    "the requested resource could not be found",
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) methodNotAllowedResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := httpError{
		StatusCode: http.StatusMethodNotAllowed,
		Message:    fmt.Sprintf("the %s method is not supported for this resource", r.Method),
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	httpErr := httpError{
		StatusCode: http.StatusBadRequest,
		Message:    err.Error(),
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) failedValidationResponse(w http.ResponseWriter, r *http.Request, errors map[string]string) {
	httpErr := httpError{
		StatusCode:       http.StatusUnprocessableEntity,
		ValidationErrors: errors,
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) editConflictResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := httpError{
		StatusCode: http.StatusConflict,
		Message:    "unable to update the record due to an edit conflict, please try again",
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) rateLimitExceededResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := httpError{
		StatusCode: http.StatusTooManyRequests,
		Message:    "rate limit exceeded",
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) invalidCredentialsResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := httpError{
		StatusCode: http.StatusUnauthorized,
		Message:    "invalid authentication credentials",
	}

	app.errorResponse(w, r, httpErr)
}
