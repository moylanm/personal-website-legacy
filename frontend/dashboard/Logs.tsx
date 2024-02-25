import React, { useCallback, useMemo } from 'react';
import { Action, AppState } from './types';

type LogsProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Logs = ({
  state,
  dispatch
}) => {

};

export default Logs;
