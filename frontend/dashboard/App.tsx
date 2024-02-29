import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { ActionType } from './types';
import { initialState, reducer } from './reducer';
import { fetchExcerpts, useInitialFetch } from './api';
import { StyledTab, StyledTabsBox } from './styled';
import ResponseSnackbar from './Snackbar';
import Tabs from '@mui/material/Tabs';
import Publisher from './Publisher';
import Editor from './Editor';
import Logs from './Logs'

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState(0);

  useInitialFetch(dispatch, state.renderKey);

  useEffect(() => {
    if (state.excerptActionSuccess) {
      fetchExcerpts(dispatch, state.renderKey);
    }
  }, [dispatch, state.excerptActionSuccess]);

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

      {activeTab === 0 &&
        <Publisher
          dispatch={dispatch}
          authors={state.authors}
          works={state.works}
          authorField={state.authorField}
          workField={state.workField}
          bodyField={state.bodyField}
        />}
      {activeTab === 1 && <Editor key={`editor-${state.renderKey}`} state={state} dispatch={dispatch} />}
      {activeTab === 2 && <Logs key={`logs-${state.renderKey}`} state={state} dispatch={dispatch} />}
      {activeTab === 3 && <div>Metrics content...</div>}

      {state.excerptActionSuccess &&
        <ResponseSnackbar severity='success' response={state.excerptActionResponse} handleClose={handleSnackbarClose} />}
      {state.excerptActionError &&
        <ResponseSnackbar severity='error' response={state.errorMessage} handleClose={handleSnackbarClose} />}
    </StyledTabsBox>
  );
};

export default App;
