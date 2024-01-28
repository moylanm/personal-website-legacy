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
  resetKey: number;
  isLoading: boolean;
  isError: boolean;
};

export enum ActionType {
  ExcerptFetchInit = 'EXCERPT_FETCH_INIT',
  ExcerptFetchSuccess = 'EXCERPT_FETCH_SUCCESS',
  ExcerptFetchFailure = 'EXCERPT_FETCH_FAILURE',
  SetSortOrder = 'SET_SORT_ORDER',
  SetSelectedAuthor = 'SET_SELECTED_AUTHOR',
  SetRandomExcerpt = 'SET_RANDOM_EXCERPT',
  Reset = 'RESET',
}

export type Action = 
  | { type: ActionType.ExcerptFetchInit }
  | { type: ActionType.ExcerptFetchSuccess; payload: { excerpts: Excerpt[]; uniqueAuthors: string[] } }
  | { type: ActionType.ExcerptFetchFailure }
  | { type: ActionType.SetSortOrder; payload: boolean }
  | { type: ActionType.SetSelectedAuthor; payload: string }
  | { type: ActionType.SetRandomExcerpt; payload: Excerpt | null }
  | { type: ActionType.Reset; payload: number };

