package main

import (
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

	dynamic := alice.New(app.sessionManager.LoadAndSave, noSurf)

	router.Handle("/about", dynamic.ThenFunc(app.about)).Methods(http.MethodGet)
	router.Handle("/", dynamic.ThenFunc(app.home)).Methods(http.MethodGet)

	excerptsPath := "/excerpts/{id:[0-9]+}"
	router.Handle(excerptsPath, dynamic.ThenFunc(app.showExcerpt)).Methods(http.MethodGet)
	router.Handle("/excerpts", dynamic.ThenFunc(app.listExcerpts)).Methods(http.MethodGet)
	router.Handle("/excerpts/json", dynamic.ThenFunc(app.listExcerptsJson)).Methods(http.MethodGet)

	router.Handle("/login", dynamic.ThenFunc(app.userLogin)).Methods(http.MethodGet)
	router.Handle("/login", dynamic.ThenFunc(app.userLoginPost)).Methods(http.MethodPost)

	protectedPage := dynamic.Append(app.requireAuthentication)

	router.Handle("/dashboard", protectedPage.ThenFunc(app.dashboard)).Methods(http.MethodGet)
	router.Handle("/logout", protectedPage.ThenFunc(app.userLogoutPost)).Methods(http.MethodPost)

	protectedAPI := alice.New(app.authenticate)

	router.Handle("/excerpts", protectedAPI.ThenFunc(app.createExcerpt)).Methods(http.MethodPost)
	router.Handle(excerptsPath, protectedAPI.ThenFunc(app.deleteExcerpt)).Methods(http.MethodDelete)
	router.Handle(excerptsPath, protectedAPI.ThenFunc(app.updateExcerpt)).Methods(http.MethodPatch)

	standard := alice.New(app.recoverPanic, app.rateLimit, secureHeaders)

	return standard.Then(router)
}
