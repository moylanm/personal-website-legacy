import React, { useRef, useState, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useIntersectionObserver from './useIntersectionObserver';
import { selectExcerptIds } from './excerptsSlice';
import { RootState } from '../../app/store';

const DeleteDialog = React.lazy(() => import('./DeleteDialog'));

const CHUNK_SIZE = 15;

const Editor = () => {
  const [displayCount, setDisplayCount] = useState(CHUNK_SIZE);
  const loadMoreRef = useRef(null);

  const dispatch = useDispatch();
  const excerptIds = useSelector(selectExcerptIds);

  const excerptStatus = useSelector((state: RootState) => state.excerpts.status);
  const error = useSelector((state: RootState) => state.excerpts.error);

  useEffect(() => {
    if (excerptStatus === 'idle') {
      // dispatch(fetchExcerpts())
    }
  }, [excerptStatus, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prevCount => Math.min(prevCount + CHUNK_SIZE, excerptIds.length));
      }
    }, {
      rootMargin: '500px'
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [excerptIds]);


};
