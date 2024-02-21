import React from 'react';
import { Action, AppState } from './types';

type PublisherProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Publisher: React.FC<PublisherProps> = ({
  state,
  dispatch
}) => {
  return (
    <>
    </>
  );
};

export default Publisher;
