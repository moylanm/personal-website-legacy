import React, { useCallback, useMemo, useReducer } from 'react';
import FilterForm from './FilterForm';
import RequestTable from './RequestTable';
import { useInitialFetch, refetchData, clearLogs } from './api';
import { reducer, initialState } from './reducer';
import { ActionType } from './types';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  useInitialFetch(dispatch);

  const handleFetchDataClick = () => {
    refetchData(dispatch, state.ipAddresses, state.renderKey);
  };

  const handleClearDataClick = () => {
    clearLogs(dispatch, state.renderKey);
  }

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionType.SetSortOrder,
      payload: event.target.value === 'oldest'
    });
  }, []);

  const handleIPAddressChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const ipAddresses = state.ipAddresses.map(ip => {
      return ip.value === target.value ? {value: ip.value, selected: target.checked} : ip
    });

    dispatch({
      type: ActionType.SetIPAddresses,
      payload: ipAddresses
    });
  }, [state.ipAddresses]);

  const sortedAndFilteredRequests = useMemo(() => {
    const selectedIPs = state.ipAddresses
      .filter(ip => ip.selected)
      .map(ip => ip.value);

    const filteredRequests = state.requests.filter(request =>
      selectedIPs.includes(request.ipAddress)
    );

    return state.reverseSort ? filteredRequests.reverse() : filteredRequests;
  }, [state.requests, state.ipAddresses, state.reverseSort]);

  if (state.isInitError) {
    return <div className='error-message'>{state.errorMessage}</div>;
  }

  if (state.isLoading) {
    return <div className='loading-message'>Loading requests...</div>;
  }

  return (
    <>
      {state.isOtherError ?? <div className='error-message'>{state.errorMessage}</div>}
      <FilterForm
        renderKey={state.renderKey}
        selectedSortOrder={state.reverseSort}
        ipAddresses={state.ipAddresses}
        onSortChange={handleSortChange}
        onIPAddrChange={handleIPAddressChange}
        onFetchDataClick={handleFetchDataClick}
        onClearDataClick={handleClearDataClick}
      />
      {sortedAndFilteredRequests.length > 0
        ? <RequestTable key={state.renderKey} requests={sortedAndFilteredRequests} />
        : <div className='loading-message'>No logs to render...</div>
      }
    </>
  );
};

export default App;
