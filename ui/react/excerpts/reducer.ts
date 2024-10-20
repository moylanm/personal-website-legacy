import type { AppState, Action } from "./types";
import { ActionType } from "./types";

export const initialState: AppState = {
  excerpts: [],
  authors: [],
  works: {},
  reverseSort: false,
  selectedAuthor: '',
  selectedWork: '',
  randomExcerpt: null,
  resetKey: 0,
  isLoading: false,
  errorMessage: '',
  isError: false
};

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionType.ExcerptsFetchInit:
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case ActionType.ExcerptsFetchSuccess:
      return {
        ...state,
        excerpts: action.payload.excerpts,
        authors: action.payload.authors,
        works: action.payload.works,
        isLoading: false,
        isError: false
      };
    case ActionType.ExcerptsFetchFailure:
      return {
        ...state,
        errorMessage: action.payload,
        isLoading: false,
        isError: true
      };
    case ActionType.SetSortOrder:
      return {
        ...state,
        reverseSort: action.payload,
        randomExcerpt: null
      };
    case ActionType.SetSelectedAuthor:
      return {
        ...state,
        selectedAuthor: action.payload,
        selectedWork: '',
        randomExcerpt: null
      };
    case ActionType.SetSelectedWork:
      return {
        ...state,
        selectedWork: action.payload
      };
    case ActionType.SetRandomExcerpt:
      return {
        ...state,
        randomExcerpt: action.payload,
        reverseSort: false,
        selectedAuthor: '',
        selectedWork: ''
      };
    case ActionType.Reset:
      return {
        ...state,
        resetKey: action.payload,
        reverseSort: false,
        selectedAuthor: '',
        selectedWork: '',
        randomExcerpt: null
      };
    default:
      return state;
  }
}
