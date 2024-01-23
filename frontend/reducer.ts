import { AppState, Action, ActionType } from "./types";

export const initialState: AppState = {
  excerpts: [],
  uniqueAuthors: [],
  reverseSort: false,
  selectedAuthor: '',
  randomExcerpt: null,
  isLoading: true,
  isError: false
};

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionType.LoadExcerptsAndAuthors:
      const uniqueAuthors = Array.from(new Set(action.payload.map(excerpt => excerpt.author)));
      return {
        ...state,
        excerpts: action.payload,
        uniqueAuthors
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
    case ActionType.SetReset:
      return {
        ...state,
        reverseSort: false,
        selectedAuthor: '',
        randomExcerpt: null
      };
    case ActionType.SetLoading:
      return {
        ...state,
        isLoading: action.payload
      };
    case ActionType.SetError:
      return {
        ...state,
        isError: action.payload
      };
    default:
      return state;
  }
}
