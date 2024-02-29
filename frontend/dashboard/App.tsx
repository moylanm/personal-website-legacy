import React, { useCallback, useReducer, useState } from 'react';
import { ActionType } from './types';
import { initialState, reducer } from './reducer';
import { useInitialFetch } from './api';
import { StyledTab, StyledTabsBox } from './styled';
import { SuccessSnackbar, ErrorSnackbar } from './Snackbar';
import Tabs from '@mui/material/Tabs';
import Publisher from './Publisher';
import Editor from './Editor';
import Logs from './Logs'

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState(0);

  useInitialFetch(dispatch, state.renderKey);

  const selectTab = useCallback((_: React.SyntheticEvent, tabId: number) => {
    setActiveTab(tabId);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    dispatch({ type: ActionType.ResetActionState });
  }, [dispatch]);

  return (
    <StyledTabsBox>
      <Tabs
        value={activeTab}
        onChange={selectTab}
        variant='fullWidth'
        textColor='inherit'
      >
        <StyledTab label='Publish' value={0} />
        <StyledTab label='Edit' value={1} />
        <StyledTab label='Logs' value={2} />
        <StyledTab label='Metrics' value={3} />
      </Tabs>

      <hr />

      {activeTab === 0 && <Publisher state={state} dispatch={dispatch} />}
      {activeTab === 1 && <Editor key={`editor-${state.renderKey}`} state={state} dispatch={dispatch} />}
      {activeTab === 2 && <Logs key={`logs-${state.renderKey}`} state={state} dispatch={dispatch} />}
      {activeTab === 3 && <div>Metrics content...</div>}

      <SuccessSnackbar state={state} handleClose={handleSnackbarClose} />
      <ErrorSnackbar state={state} handleClose={handleSnackbarClose} />
    </StyledTabsBox>
  );
};

export default App;
