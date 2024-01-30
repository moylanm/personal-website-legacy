import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Excerpt } from './types';

const CHUNK_SIZE = 7;

const List: React.FC<{excerpts: Excerpt[]}> = ({ excerpts }) => {
  const [displayCount, setDisplayCount] = useState(CHUNK_SIZE);
  const loadMoreRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prevCount => Math.min(prevCount + CHUNK_SIZE, excerpts.length));
      }
    }, {
      threshold: 1.0
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [excerpts]);

  return (
    <>
      {excerpts.slice(0, displayCount).map((excerpt) => <Item key={excerpt.id} excerpt={excerpt} />)}
      {displayCount < excerpts.length && <div ref={loadMoreRef} className='loading-message'>Loading more...</div>}
    </>
  );
}

const Item: React.FC<{excerpt: Excerpt}> = ({ excerpt }) => {
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
