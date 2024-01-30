package main

import (
	"fmt"
	"html/template"
	"io/fs"
	"path/filepath"
	"strings"
	"time"

	"github.com/russross/blackfriday/v2"
	"mylesmoylan.net/internal/data"
	"mylesmoylan.net/ui"
)

type templateData struct {
	CurrentYear  int
	Excerpt      data.Excerpt
	Excerpts     []data.Excerpt
	Metadata     data.Metadata
	StatusCode   int
	ErrorMessage any
}

func humanDate(t time.Time) string {
	if t.IsZero() {
		return ""
	}

	return t.In(time.Local).Format("02 Jan 2006 at 15:04")
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

func markdownToHTML(args ...interface{}) (template.HTML, error) {
	var sb strings.Builder

	for _, arg := range args {
		_, err := sb.WriteString(fmt.Sprintf("%v", arg))
		if err != nil {
			return "", fmt.Errorf("error building markdown string: %w", err)
		}
	}

	markdown, err := processMarkdown(sb.String())
	if err != nil {
		return "", fmt.Errorf("error processing markdown: %w", err)
	}

	return template.HTML(markdown), nil
}

func processMarkdown(input string) ([]byte, error) {
	return blackfriday.Run([]byte(input)), nil
}

func inc(num int) int {
	return num + 1
}

func dec(num int) int {
	return num - 1
}

var functions = template.FuncMap{
	"humanDate":      humanDate,
	"pageRange":      pageRange,
	"pageSizes":      pageSizes,
	"markdownToHTML": markdownToHTML,
	"inc":            inc,
	"dec":            dec,
}

func newTemplateCache() (map[string]*template.Template, error) {
	pages, err := fs.Glob(ui.Files, "html/pages/*.tmpl")
	if err != nil {
		return nil, err
	}

	cache := make(map[string]*template.Template, len(pages))

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
