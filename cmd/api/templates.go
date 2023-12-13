package main

import (
	"fmt"
	"html/template"
	"io/fs"
	"path/filepath"
	"time"

	"github.com/russross/blackfriday/v2"
	"mylesmoylan.net/internal/data"
	"mylesmoylan.net/ui"
)

type templateData struct {
	CurrentYear int
	Excerpt     data.Excerpt
	Excerpts    []data.Excerpt
	Metadata    data.Metadata
}

func humanDate(t time.Time) string {
	if t.IsZero() {
		return ""
	}

	loc, err := time.LoadLocation("America/Los_Angeles")
	if err != nil {
		return ""
	}

	return t.In(loc).Format("02 Jan 2006 at 15:04")
}

func pageRange(last int) []int {
	r := make([]int, last)
	for i := range r {
		r[i] = i + 1
	}
	return r
}

func pageSizes() []int {
	return []int{5, 10, 25, 50}
}

func markdownToHTML(args ...interface{}) template.HTML {
	markdown := blackfriday.Run([]byte(fmt.Sprintf("%s", args...)))
	return template.HTML(markdown)
}

var functions = template.FuncMap{
	"humanDate":      humanDate,
	"pageRange":      pageRange,
	"pageSizes":      pageSizes,
	"markdownToHTML": markdownToHTML,
}

func newTemplateCache() (map[string]*template.Template, error) {
	cache := map[string]*template.Template{}

	pages, err := fs.Glob(ui.Files, "html/pages/*.tmpl")
	if err != nil {
		return nil, err
	}

	for _, page := range pages {
		name := filepath.Base(page)

		patterns := []string{
			"html/base.tmpl",
			"html/partials/*.tmpl",
			page,
		}

		ts, err := template.New(name).Funcs(functions).ParseFS(ui.Files, patterns...)
		if err != nil {
			return nil, err
		}

		cache[name] = ts
	}

	return cache, nil
}
