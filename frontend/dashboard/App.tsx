import React, { useState } from 'react';
import Logs from './logs/Logs'

const App = () => {
  const [activeTab, setActiveTab] = useState<string>('publish');

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

      <div className='tab-content'>
        {activeTab === 'publish' && <div>Publish content...</div>}
        {activeTab === 'edit' && <div>Edit content...</div>}
        {activeTab === 'logs' && <Logs />}
        {activeTab === 'metrics' && <div>Metrics content...</div>}
      </div>
    </>
  );
};

export default App;
