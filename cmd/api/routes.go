package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"mylesmoylan.net/ui"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	fileServer := http.FileServer(http.FS(ui.Files))

	router.Handler(http.MethodGet, "/static/*filepath", fileServer)

	router.HandlerFunc(http.MethodGet, "/healthcheck", app.healthcheckHandler)

	router.HandlerFunc(http.MethodGet, "/excerpts", app.listExcerptsHandler)
	router.HandlerFunc(http.MethodPost, "/excerpts", app.authenticate(app.createExcerptHandler))
	router.HandlerFunc(http.MethodGet, "/excerpts/:id", app.showExcerptHandler)
	router.HandlerFunc(http.MethodPatch, "/excerpts/:id", app.authenticate(app.updateExcerptHandler))
	router.HandlerFunc(http.MethodDelete, "/excerpts/:id", app.authenticate(app.deleteExcerptHandler))

	return app.recoverPanic(app.rateLimit(router))
}
