import React, {useEffect, useReducer} from 'react';
import axios from 'axios';
import List from './List';
import FilterForm from './FilterForm';

const BASE_API_ENDPOINT = 'https://mylesmoylan.net/excerpts/json';

type Excerpt = {
  id: number;
  author: string;
  work: string;
  body: string;
}

type AppState = {
  excerpts: Excerpt[];
  uniqueAuthors: string[];
  reverseSort: boolean;
  selectedAuthor: string;
  randomExcerpt: Excerpt | null;
  isLoading: boolean;
}

type Action = 
  | { type: 'LOAD_EXCERPTS_AND_AUTHORS'; payload: Excerpt[] }
  | { type: 'SET_SORT_ORDER'; payload: boolean }
  | { type: 'SET_SELECTED_AUTHOR'; payload: string }
  | { type: 'SET_RANDOM_EXCERPT'; payload: Excerpt | null }
  | { type: 'SET_RESET', payload: null }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  excerpts: [],
  uniqueAuthors: [],
  reverseSort: false,
  selectedAuthor: '',
  randomExcerpt: null,
  isLoading: true
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOAD_EXCERPTS_AND_AUTHORS':
      const uniqueAuthors = Array.from(new Set(action.payload.map(excerpt => excerpt.author)));
      return {
        ...state,
        excerpts: action.payload,
        uniqueAuthors: uniqueAuthors
      };
    case 'SET_SORT_ORDER':
      return {
        ...state,
        reverseSort: action.payload,
        randomExcerpt: null
      };
    case 'SET_SELECTED_AUTHOR':
      return {
        ...state,
        selectedAuthor: action.payload,
        randomExcerpt: null
      };
    case 'SET_RANDOM_EXCERPT':
      return {
        ...state,
        randomExcerpt: action.payload,
        reverseSort: false,
        selectedAuthor: ''
      };
    case 'SET_RESET':
      return {
        ...state,
        reverseSort: false,
        selectedAuthor: '',
        randomExcerpt: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_API_ENDPOINT}`);
        dispatch({
          type: 'LOAD_EXCERPTS_AND_AUTHORS',
          payload: response.data['excerpts'].map((item: Excerpt): Excerpt => {
            return {
              id: item.id,
              author: item.author,
              work: item.work,
              body: item.body
            }
          })
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [])

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_SORT_ORDER',
      payload: event.target.value === 'oldest'
    });
  }

  const handleAuthorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'SET_SELECTED_AUTHOR',
      payload: event.target.value
    });
  }

  const handleRandomClick = () => {
    if (state.excerpts.length === 0) return;

    const randomIndex = Math.floor(Math.random() * state.excerpts.length);

    dispatch({
      type: 'SET_RANDOM_EXCERPT',
      payload: state.excerpts[randomIndex]
    });
  }

  const handleReset = () => {
    dispatch({
      type: 'SET_RESET',
      payload: null
    });
  }
  
  const sortedAndFilteredExcerpts = (): Excerpt[] => {
    if (state.randomExcerpt) return [state.randomExcerpt];

    return state.excerpts
      .filter(excerpt => !state.selectedAuthor || excerpt.author === state.selectedAuthor)
      .sort((a, b) => state.reverseSort ? a.id - b.id : b.id - a.id);
  };

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FilterForm
        selectedSortOrder={state.reverseSort}
        onSortChange={handleSortChange}
        selectedAuthor={state.selectedAuthor}
        uniqueAuthors={state.uniqueAuthors}
        onAuthorChange={handleAuthorChange}
        onRandomClick={handleRandomClick}
        onReset={handleReset}
      />  
      <List excerpts={sortedAndFilteredExcerpts()} />
    </>
  );
}

export {
  Excerpt,
}

export default App
