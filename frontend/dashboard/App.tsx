import React, { useReducer, useState } from 'react';
import { initialState, reducer } from './reducer';
import { useInitialFetch } from './api';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Publisher from './Publisher';
import Editor from './Editor';
import Logs from './logs/Logs'

const tabStyle = {
  opacity: 1,
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#1876D2'
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState<number>(0);

  useInitialFetch(dispatch);

  const selectTab = (_: React.SyntheticEvent, tabId: number) => {
    setActiveTab(tabId);
  }

  return (
    <Box sx={{ backgroundColor: 'inherit' }}>
      <Tabs
        value={activeTab}
        onChange={selectTab}
        variant='fullWidth'
        textColor='inherit'
      >
        <Tab label='Publish' value={0} sx={tabStyle} />
        <Tab label='Edit' value={1} sx={tabStyle} />
        <Tab label='Logs' value={2} sx={tabStyle} />
        <Tab label='Metrics' value={3} sx={tabStyle}/>
      </Tabs>

      <hr />

      {activeTab === 0 && <Publisher state={state} dispatch={dispatch} />}
      {activeTab === 1 && <Editor state={state} dispatch={dispatch} />}
      {activeTab === 2 && <Logs />}
      {activeTab === 3 && <div>Metrics content...</div>}
    </Box>
  );
};

export default App;
