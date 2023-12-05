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

	router.HandlerFunc(http.MethodGet, "/", app.home)
	router.HandlerFunc(http.MethodGet, "/about", app.about)
	router.HandlerFunc(http.MethodGet, "/json/excerpts", app.authenticate(app.listJsonExcerpts))
	router.HandlerFunc(http.MethodGet, "/excerpts", app.listExcerpts)
	router.HandlerFunc(http.MethodPost, "/excerpts", app.authenticate(app.createExcerpt))
	router.HandlerFunc(http.MethodGet, "/excerpts/:id", app.showExcerpt)
	router.HandlerFunc(http.MethodPatch, "/excerpts/:id", app.authenticate(app.updateExcerpt))
	router.HandlerFunc(http.MethodDelete, "/excerpts/:id", app.authenticate(app.deleteExcerpt))

	return app.recoverPanic(app.rateLimit(router))
}
