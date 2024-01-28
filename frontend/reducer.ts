import { AppState, Action, ActionType } from "./types";

export const initialState: AppState = {
  excerpts: [],
  uniqueAuthors: [],
  reverseSort: false,
  selectedAuthor: '',
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
        uniqueAuthors: action.payload.uniqueAuthors,
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
        randomExcerpt: null
      };
    case ActionType.SetRandomExcerpt:
      return {
        ...state,
        randomExcerpt: action.payload,
        reverseSort: false,
        selectedAuthor: ''
      };
    case ActionType.Reset:
      return {
        ...state,
        resetKey: action.payload,
        reverseSort: false,
        selectedAuthor: '',
        randomExcerpt: null
      };
    default:
      return state;
  }
}
