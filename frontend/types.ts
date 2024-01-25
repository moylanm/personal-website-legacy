export type Excerpt = {
  id: number;
  author: string;
  work: string;
  body: string;
};

export type AppState = {
  excerpts: Excerpt[];
  uniqueAuthors: string[];
  reverseSort: boolean;
  selectedAuthor: string;
  randomExcerpt: Excerpt | null;
  isLoading: boolean;
  isError: boolean;
};

export enum ActionType {
  LoadExcerptsAndAuthors = 'LOAD_EXCERPTS_AND_AUTHORS',
  SetSortOrder = 'SET_SORT_ORDER',
  SetSelectedAuthor = 'SET_SELECTED_AUTHOR',
  SetRandomExcerpt = 'SET_RANDOM_EXCERPT',
  SetLoading = 'SET_LOADING',
  SetError = 'SET_ERROR',
  Reset = 'RESET',
}

export type Action = 
  | { type: ActionType.LoadExcerptsAndAuthors; payload: Excerpt[] }
  | { type: ActionType.SetSortOrder; payload: boolean }
  | { type: ActionType.SetSelectedAuthor; payload: string }
  | { type: ActionType.SetRandomExcerpt; payload: Excerpt | null }
  | { type: ActionType.SetLoading; payload: boolean }
  | { type: ActionType.SetError; payload: boolean }
  | { type: ActionType.Reset };

