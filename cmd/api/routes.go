package main

import (
	"expvar"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/justinas/alice"
	"mylesmoylan.net/ui"
)

func (app *application) routes() http.Handler {
	router := mux.NewRouter()

	router.NotFoundHandler = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowedHandler = http.HandlerFunc(app.methodNotAllowedResponse)

	fileServer := http.FileServer(http.FS(ui.Files))
	router.PathPrefix("/static/").Handler(fileServer)

	dynamic := alice.New(app.sessionManager.LoadAndSave, noSurf, app.authenticate)

	router.Handle("/", dynamic.ThenFunc(app.home)).Methods(http.MethodGet)
	router.Handle("/excerpts/json", dynamic.ThenFunc(app.listExcerptsJson)).Methods(http.MethodGet)
	router.Handle("/login", dynamic.ThenFunc(app.userLoginPost)).Methods(http.MethodPost)

	protected := dynamic.Append(app.requireAuthentication)

	excerptsPath := "/excerpts/{id:[0-9]+}"
	router.Handle("/excerpts", protected.ThenFunc(app.createExcerpt)).Methods(http.MethodPost)
	router.Handle(excerptsPath, protected.ThenFunc(app.updateExcerpt)).Methods(http.MethodPatch)
	router.Handle(excerptsPath, protected.ThenFunc(app.deleteExcerpt)).Methods(http.MethodDelete)

	router.Handle("/dashboard/metrics", protected.Then(expvar.Handler())).Methods(http.MethodGet)
	router.Handle("/logout", protected.ThenFunc(app.userLogoutPost)).Methods(http.MethodPost)

	standard := alice.New(app.recoverPanic, app.enableCORS, app.rateLimit, secureHeaders)

	return standard.Then(router)
}
