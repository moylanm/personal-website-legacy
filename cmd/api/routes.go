package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"mylesmoylan.net/ui"
)

func (app *application) routes() http.Handler {
	router := mux.NewRouter()

	router.NotFoundHandler = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowedHandler = http.HandlerFunc(app.methodNotAllowedResponse)

	fileServer := http.FileServer(http.FS(ui.Files))

	router.PathPrefix("/static/").Handler(fileServer)

	router.HandleFunc("/healthcheck", app.healthcheckHandler).Methods(http.MethodGet)

	router.HandleFunc("/excerpts/{id:[0-9]+}", app.authenticate(app.deleteExcerpt)).Methods(http.MethodDelete)
	router.HandleFunc("/excerpts/{id:[0-9]+}", app.authenticate(app.updateExcerpt)).Methods(http.MethodPatch)
	router.HandleFunc("/excerpts/{id:[0-9]+}", app.showExcerpt).Methods(http.MethodGet)
	router.HandleFunc("/excerpts/json", app.authenticate(app.listExcerptsJson)).Methods(http.MethodGet)
	router.HandleFunc("/excerpts", app.authenticate(app.createExcerpt)).Methods(http.MethodPost)
	router.HandleFunc("/excerpts", app.listExcerpts).Methods(http.MethodGet)
	router.HandleFunc("/about", app.about).Methods(http.MethodGet)
	router.HandleFunc("/", app.home).Methods(http.MethodGet)

	return app.recoverPanic(app.rateLimit(router))
}
