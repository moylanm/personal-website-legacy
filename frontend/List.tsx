import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Excerpt, Excerpts } from './App';

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

export default List;
