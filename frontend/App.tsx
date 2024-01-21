import React, {useEffect, useState} from 'react';
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

type Excerpts = Excerpt[];

const App = () => {
  const [excerpts, setExcerpts] = useState<Excerpts>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_API_ENDPOINT}`);
        setExcerpts(
          response.data['excerpts'].map((item: Excerpt): Excerpt => {
            return {
              id: item.id,
              author: item.author,
              work: item.work,
              body: item.body
            }
          })
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [])

  if (!excerpts) {
    return <div>Loading...</div>;
  }

  const handleAuthorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthor(event.target.value);
  }

  const uniqueAuthors = Array.from(new Set(excerpts.map(excerpt => excerpt.author)));
  const filteredExcerpts = selectedAuthor 
    ? excerpts.filter(excerpt => excerpt.author === selectedAuthor) 
    : excerpts;

  return (
    <>
      <FilterForm
        selectedAuthor={selectedAuthor}
        uniqueAuthors={uniqueAuthors}
        onAuthorChange={handleAuthorChange}
      />  
      <List excerpts={filteredExcerpts} />
    </>
  );
}

export {
  Excerpt,
  Excerpts,
}

export default App
