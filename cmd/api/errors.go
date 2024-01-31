package main

import (
	"fmt"
	"net/http"
	"strings"
)

type HTTPError struct {
	StatusCode int
	Message    string
}

func (e HTTPError) Error() string {
	return e.Message
}

func (app *application) logError(r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	app.logger.Error(err.Error(), "method", method, "uri", uri)
}

func (app *application) errorResponse(w http.ResponseWriter, r *http.Request, httpErr HTTPError) {
	status := httpErr.StatusCode
	message := httpErr.Message

	if strings.HasPrefix(r.Header.Get("Accept"), "text/html") {
		data := app.newTemplateData()
		data.StatusCode = status
		data.ErrorMessage = message
		app.render(w, r, status, "error.tmpl", data)
	} else {
		env := envelope{"error": message}
		err := app.writeJSON(w, status, env)
		if err != nil {
			app.logError(r, err)
			w.WriteHeader(500)
		}
	}
}

func (app *application) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logError(r, err)

	httpErr := HTTPError{
		StatusCode: http.StatusInternalServerError,
		Message:    "the server encountered a problem and could not process your request",
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := HTTPError{
		StatusCode: http.StatusNotFound,
		Message:    "the requested resource could not be found",
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) methodNotAllowedResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := HTTPError{
		StatusCode: http.StatusMethodNotAllowed,
		Message:    fmt.Sprintf("the %s method is not supported for this resource", r.Method),
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	httpErr := HTTPError{
		StatusCode: http.StatusBadRequest,
		Message:    err.Error(),
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) failedValidationResponse(w http.ResponseWriter, r *http.Request, errors map[string]string) {
	var sb strings.Builder

	for k, v := range errors {
		sb.WriteString(fmt.Sprintf("%s: %s\n", k, v))
	}

	httpErr := HTTPError{
		StatusCode: http.StatusUnprocessableEntity,
		Message:    sb.String(),
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) editConflictResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := HTTPError{
		StatusCode: http.StatusConflict,
		Message:    "unable to update the record due to an edit conflict, please try again",
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) rateLimitExceededResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := HTTPError{
		StatusCode: http.StatusTooManyRequests,
		Message:    "rate limit exceeded",
	}

	app.errorResponse(w, r, httpErr)
}

func (app *application) invalidCredentialsResponse(w http.ResponseWriter, r *http.Request) {
	httpErr := HTTPError{
		StatusCode: http.StatusUnauthorized,
		Message:    "invalid authentication credentials",
	}

	app.errorResponse(w, r, httpErr)
}
