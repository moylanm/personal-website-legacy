import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Excerpt } from './App';

type ListProps = {
  excerpts: Excerpt[];
};

const List: React.FC<ListProps> = ({ excerpts }) => {
  return excerpts.map((excerpt) => 
    <Item 
      key={excerpt.id}
      excerpt={excerpt}
    />
  );
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
