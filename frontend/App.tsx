import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const BASE_API_ENDPOINT = 'https://mylesmoylan.net/excerpts/json';

type Excerpt = {
  id: number;
  author: string;
  work: string;
  body: string;
}

type Excerpts = Excerpt[];

const App = () => {
  const [excerpts, setExcerpts] = useState([]);

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

  return (
    <>
      <List excerpts={excerpts} />
    </>
  );
}

type ListProps = {
  excerpts: Excerpts;
};

const List: React.FC<ListProps> = ({ excerpts }) => {
  const listItems = excerpts.map((excerpt) => 
    <Item 
      key={excerpt.id}
      excerpt={excerpt}
    />
  );
  return listItems;
}

type ItemProps = {
  excerpt: Excerpt;
};

const Item: React.FC<ItemProps> = ({ excerpt }) => {
  return (
    <>
      <div className='text-box'>
        <div className='metadata'>
          <a href={'/excerpts/' + excerpt.id}>
            <strong>{excerpt.author}</strong>
            <br />
            <strong>{excerpt.work}</strong>
          </a>
        </div>
        <hr />
        <div className='body'>
          <ReactMarkdown>{excerpt.body}</ReactMarkdown>
        </div>
      </div>
      <br />
    </>
  );
}

export default App
