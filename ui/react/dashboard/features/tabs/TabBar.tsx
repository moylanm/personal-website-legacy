import React, { useCallback, useState } from 'react';
import { StyledBox, StyledTab } from './style';
import Tabs from '@mui/material/Tabs';
import Publisher from '../excerpts/Publisher';
import Editor from '../excerpts/Editor';
import Metrics from '../metrics/Metrics';

const TabBar = () => {
	const [activeTab, setActiveTab] = useState(0);

	const selectTab = useCallback((_: React.SyntheticEvent, tabId: number) => {
		setActiveTab(tabId);
	}, []);

  return (
    <StyledBox>
      <Tabs
        value={activeTab}
        onChange={selectTab}
        variant='fullWidth'
        textColor='inherit'
      >
        <StyledTab label='Publish' value={0} />
        <StyledTab label='Edit' value={1} />
        <StyledTab label='Metrics' value={2} />
      </Tabs>

      <hr />

      {activeTab === 0 && <Publisher />}
      {activeTab === 1 && <Editor />}
      {activeTab === 2 && <Metrics />}
    </StyledBox>
  );
}

export default TabBar;
