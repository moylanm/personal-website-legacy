import React, { useReducer, useState } from 'react';
import { ActionType } from './types';
import { initialState, reducer } from './reducer';
import { useInitialFetch } from './api';
import { SuccessSnackbar, ErrorSnackbar } from './Snackbar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Publisher from './Publisher';
import Editor from './Editor';
import Logs from './Logs'
import { StyledTab } from './styled';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState(0);

  useInitialFetch(dispatch, state.renderKey);

  const selectTab = (_: React.SyntheticEvent, tabId: number) => {
    setActiveTab(tabId);
  };

  const handleSnackbarClose = () => {
    dispatch({ type: ActionType.ResetActionState });
  };

  return (
    <Box sx={{ backgroundColor: 'inherit' }}>
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
      {activeTab === 1 && <Editor key={state.renderKey} state={state} dispatch={dispatch} />}
      {activeTab === 2 && <Logs key={state.renderKey} state={state} dispatch={dispatch} />}
      {activeTab === 3 && <div>Metrics content...</div>}
      <SuccessSnackbar state={state} handleClose={handleSnackbarClose} />
      <ErrorSnackbar state={state} handleClose={handleSnackbarClose} />
    </Box>
  );
};

export default App;
