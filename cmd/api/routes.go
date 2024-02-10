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

	dynamic := alice.New(app.sessionManager.LoadAndSave)

	router.Handle("/about", dynamic.ThenFunc(app.about)).Methods(http.MethodGet)
	router.Handle("/", dynamic.ThenFunc(app.home)).Methods(http.MethodGet)

	excerptsPath := "/excerpts/{id:[0-9]+}"
	router.Handle(excerptsPath, dynamic.ThenFunc(app.showExcerpt)).Methods(http.MethodGet)
	router.Handle("/excerpts", dynamic.ThenFunc(app.listExcerpts)).Methods(http.MethodGet)
	router.Handle("/excerpts/json", dynamic.ThenFunc(app.listExcerptsJson)).Methods(http.MethodGet)

	router.Handle("/signup", dynamic.ThenFunc(app.userSignup)).Methods(http.MethodGet)
	router.Handle("/signup", dynamic.ThenFunc(app.userSignupPost)).Methods(http.MethodPost)
	router.Handle("/login", dynamic.ThenFunc(app.userLogin)).Methods(http.MethodGet)
	router.Handle("/login", dynamic.ThenFunc(app.userLoginPost)).Methods(http.MethodPost)
	router.Handle("/logout", dynamic.ThenFunc(app.userLogoutPost)).Methods(http.MethodPost)

	dynamicAuth := dynamic.Append(app.authenticate)

	router.Handle("/excerpts", dynamicAuth.ThenFunc(app.createExcerpt)).Methods(http.MethodPost)
	router.Handle(excerptsPath, dynamicAuth.ThenFunc(app.deleteExcerpt)).Methods(http.MethodDelete)
	router.Handle(excerptsPath, dynamicAuth.ThenFunc(app.updateExcerpt)).Methods(http.MethodPatch)


	standard := alice.New(app.recoverPanic, app.rateLimit, secureHeaders)

	return standard.Then(router)
}
