import React, { useCallback, useMemo } from 'react';
import { Action, AppState } from './types';
import RequestTable from './RequestTable';

type LogsProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Logs: React.FC<LogsProps> = ({
  state,
  dispatch
}) => {
  return (
    <>
      <RequestTable requests={state.requests} />
    </>
  );
};

export default Logs;
