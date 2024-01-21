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
  sortOrder: string;
  selectedAuthor: string;
  randomExcerpt: Excerpt | null;
  isLoading: boolean;
}

type Action = 
  | { type: 'SET_EXCERPTS'; payload: Excerpt[] }
  | { type: 'SET_SORT_ORDER'; payload: string }
  | { type: 'SET_SELECTED_AUTHOR'; payload: string }
  | { type: 'SET_RANDOM_EXCERPT'; payload: Excerpt | null }
  | { type: 'SET_RESET', payload: null }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  excerpts: [],
  sortOrder: 'newest',
  selectedAuthor: '',
  randomExcerpt: null,
  isLoading: true
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_EXCERPTS':
      return {
        ...state,
        excerpts: action.payload
      };
    case 'SET_SORT_ORDER':
      return {
        ...state,
        sortOrder: action.payload,
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
        sortOrder: 'newest',
        selectedAuthor: ''
      };
    case 'SET_RESET':
      return {
        ...state,
        sortOrder: 'newest',
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
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const response = await axios.get(`${BASE_API_ENDPOINT}`);
        dispatch({
          type: 'SET_EXCERPTS',
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
        dispatch({ type: 'SET_LOADING', payload: false});
      }
    };

    fetchData();
  }, [])

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_SORT_ORDER',
      payload: event.target.value
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

  const uniqueAuthors = Array.from(new Set(excerpts.map(excerpt => excerpt.author)));
  
  const sortedAndFilteredExcerpts = (): Excerpt[] => {
    if (randomExcerpt) return [randomExcerpt];

    return excerpts
      .filter(excerpt => !selectedAuthor || excerpt.author === selectedAuthor)
      .sort((a, b) => sortOrder === 'oldest' ? a.id - b.id : b.id - a.id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FilterForm
        selectedSortOrder={sortOrder}
        onSortChange={handleSortChange}
        selectedAuthor={selectedAuthor}
        uniqueAuthors={uniqueAuthors}
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
  Excerpts,
}

export default App
