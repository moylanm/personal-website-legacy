import { AppState, Action, ActionType } from "./types";

export const initialState: AppState = {
  excerpts: [],
  uniqueAuthors: [],
  reverseSort: false,
  selectedAuthor: '',
  randomExcerpt: null,
  resetKey: 0,
  isLoading: false,
  isError: false
};

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionType.ExcerptFetchInit:
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case ActionType.ExcerptFetchSuccess:
      return {
        ...state,
        excerpts: action.payload.excerpts,
        uniqueAuthors: action.payload.uniqueAuthors,
        isLoading: false,
        isError: false
      };
    case ActionType.ExcerptFetchFailure:
      return {
        ...state,
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
