export type Excerpt = {
  id: number;
  author: string;
  work: string;
  body: string;
};

export type AppState = {
  excerpts: Excerpt[];
  authors: string[];
  works: { [author: string]: string[] };
  reverseSort: boolean;
  selectedAuthor: string;
  selectedWork: string,
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
  SetSelectedWork = 'SET_SELECTED_WORK',
  SetRandomExcerpt = 'SET_RANDOM_EXCERPT',
  Reset = 'RESET',
};

type ExcerptsFetchSuccessPayload = {
  excerpts: Excerpt[];
  authors: string[];
  works: { [author: string]: string[] }
}

export type Action = 
  | { type: ActionType.ExcerptsFetchInit }
  | { type: ActionType.ExcerptsFetchSuccess; payload: ExcerptsFetchSuccessPayload }
  | { type: ActionType.ExcerptsFetchFailure; payload: string }
  | { type: ActionType.SetSortOrder; payload: boolean }
  | { type: ActionType.SetSelectedAuthor; payload: string }
  | { type: ActionType.SetSelectedWork; payload: string }
  | { type: ActionType.SetRandomExcerpt; payload: Excerpt | null }
  | { type: ActionType.Reset; payload: number };

export type ApiResponse = {
  excerpts: Excerpt[];
};
