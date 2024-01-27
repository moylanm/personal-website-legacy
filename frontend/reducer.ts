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
      return {
        ...state,
        excerpts: action.payload.excerpts,
        uniqueAuthors: action.payload.uniqueAuthors,
        isLoading: false,
        isError: false
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
    case ActionType.Reset:
      return {
        ...state,
        reverseSort: false,
        selectedAuthor: '',
        randomExcerpt: null,
      };
    default:
      return state;
  }
}
