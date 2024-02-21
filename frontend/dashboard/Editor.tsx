import React from 'react';
import { Action, AppState } from './types';

type EditorProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const Editor: React.FC<EditorProps> = ({
  state,
  dispatch
}) => {
  return (
    <>
    </>
  );
};

export default Editor;
