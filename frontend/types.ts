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
  errorMessage: string;
  isError: boolean;
};

export enum ActionType {
  ExcerptsFetchInit = 'EXCERPTS_FETCH_INIT',
  ExcerptsFetchSuccess = 'EXCERPTS_FETCH_SUCCESS',
  ExcerptsFetchFailure = 'EXCERPTS_FETCH_FAILURE',
  SetSortOrder = 'SET_SORT_ORDER',
  SetSelectedAuthor = 'SET_SELECTED_AUTHOR',
  SetRandomExcerpt = 'SET_RANDOM_EXCERPT',
  Reset = 'RESET',
}

export type Action = 
  | { type: ActionType.ExcerptsFetchInit }
  | { type: ActionType.ExcerptsFetchSuccess; payload: { excerpts: Excerpt[]; uniqueAuthors: string[] } }
  | { type: ActionType.ExcerptsFetchFailure; payload: string }
  | { type: ActionType.SetSortOrder; payload: boolean }
  | { type: ActionType.SetSelectedAuthor; payload: string }
  | { type: ActionType.SetRandomExcerpt; payload: Excerpt | null }
  | { type: ActionType.Reset; payload: number };

