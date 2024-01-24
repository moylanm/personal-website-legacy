import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Excerpt } from './types';

type ListProps = {
  excerpts: Excerpt[];
};

const List: React.FC<ListProps> = ({ excerpts }) => {
  return excerpts.map((excerpt) => <Item key={excerpt.id} excerpt={excerpt} />);
}

type ItemProps = {
  excerpt: Excerpt;
};

const Item: React.FC<ItemProps> = ({ excerpt }) => {
  return (
    <article className='excerpt-item'>
      <header className='excerpt-metadata'>
        <a href={`/excerpts/${excerpt.id}`} aria-label={`Read an excerpt from ${excerpt.work} by ${excerpt.author}`}>
          <strong>{excerpt.author}</strong>
          <br />
          <strong>{excerpt.work}</strong>
        </a>
      </header>
      <hr />
      <div className='excerpt-body'>
        <ReactMarkdown>{excerpt.body}</ReactMarkdown>
      </div>
    </article>
  );
}

export default List;
