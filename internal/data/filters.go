package data

import (
	"strings"

	"mylesmoylan.net/internal/validator"
)

type Filters struct {
	Sort         string
	SortSafeList []string
}

func (f Filters) sortColumn() string {
	for _, safeValue := range f.SortSafeList {
		if f.Sort == safeValue {
			return strings.TrimPrefix(f.Sort, "-")
		}
	}

	panic("unsafe sort parameter: " + f.Sort)
}

func (f Filters) sortDirection() string {
	if strings.HasPrefix(f.Sort, "-") {
		return "DESC"
	}

	return "ASC"
}

func ValidateFilters(v *validator.Validator, f Filters) {
	v.Check(validator.PermittedValue(f.Sort, f.SortSafeList...), "sort", "invalid sort value")
}

type Metadata struct {
	Sort           string   `json:"sort,omitempty"`
	SelectedAuthor string   `json:"selected_author,omitempty"`
	Authors        []string `json:"authors,omitempty"`
	CurrentPage    int      `json:"current_page,omitempty"`
	PageSize       int      `json:"page_size,omitempty"`
	FirstPage      int      `json:"first_page,omitempty"`
	LastPage       int      `json:"last_page,omitempty"`
	TotalRecords   int      `json:"total_records,omitempty"`
}

func calculateMetadata(totalRecords int, selectedAuthor string, authors []string, filters Filters) Metadata {
	if totalRecords == 0 {
		return Metadata{}
	}

	return Metadata{
		Sort:           filters.Sort,
		SelectedAuthor: selectedAuthor,
		Authors:        authors,
		TotalRecords:   totalRecords,
	}
}
