import React, { useReducer, useState } from 'react';
import { initialState, reducer } from './reducer';
import Logs from './logs/Logs'
import Publisher from './Publisher';
import Editor from './Editor';
import useInitialFetch from './useInitialFetch';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState<string>('publish');

  useInitialFetch(dispatch);

  const selectTab = (tabId: string) => {
    setActiveTab(tabId);
  }

  return (
    <>
      <div className='tab-headers'>
        <button onClick={() => selectTab('publish')} className={activeTab === 'publish' ? 'active' : ''}>
          Publish
        </button>
        <button onClick={() => selectTab('edit')} className={activeTab === 'edit' ? 'active' : ''}>
          Edit
        </button>
        <button onClick={() => selectTab('logs')} className={activeTab === 'logs' ? 'active' : ''}>
          Logs
        </button>
        <button onClick={() => selectTab('metrics')} className={activeTab === 'metrics' ? 'active' : ''}>
          Metrics
        </button>
      </div>

      <hr />

      <div className='tab-content'>
        {activeTab === 'publish' && <Publisher state={state} dispatch={dispatch} />}
        {activeTab === 'edit' && <Editor state={state} dispatch={dispatch} />}
        {activeTab === 'logs' && <Logs />}
        {activeTab === 'metrics' && <div>Metrics content...</div>}
      </div>
    </>
  );
};

export default App;
