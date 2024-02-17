import React, { useCallback, useMemo, useReducer } from 'react';
import FilterForm from './FilterForm';
import RequestTable from './RequestTable';
import { useInitialFetch, refetchData } from './fetch';
import { reducer, initialState } from './reducer';
import { ActionType } from './types';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  useInitialFetch(dispatch);

  const handleFetchDataClick = () => {
    refetchData(dispatch, state.renderKey);
  };

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionType.SetSortOrder,
      payload: event.target.value === 'oldest'
    });
  }, []);

  const handleIPAddressChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    let selectedIPAddresses: string[];

    if (target.checked) {
      selectedIPAddresses = [...state.selectedIPAddresses, target.value];
    } else {
      selectedIPAddresses = state.selectedIPAddresses.filter(ipAddress => ipAddress !== target.value);
    }

    dispatch({
      type: ActionType.SetSelectedIPAddresses,
      payload: selectedIPAddresses
    });
  }, [state.selectedIPAddresses]);

  const sortedAndFilteredRequests = useMemo(() => {
    const filteredRequests = state.requests.filter(request => {
      return state.selectedIPAddresses.includes(request.ipAddress);
    });

    return state.reverseSort ? filteredRequests.reverse() : filteredRequests;
  }, [state.requests, state.selectedIPAddresses, state.reverseSort]);

  if (state.isInitError) {
    return <div className='error-message'>{state.errorMessage}</div>;
  }

  if (state.isLoading) {
    return <div className='loading-message'>Loading requests...</div>;
  }

  return (
    <>
      {state.isRefetchError ?? <div className='error-message'>{state.errorMessage}</div>}
      <FilterForm
        key={state.renderKey}
        selectedSortOrder={state.reverseSort}
        ipAddresses={state.ipAddresses}
        onSortChange={handleSortChange}
        onIPAddrChange={handleIPAddressChange}
        onFetchDataClick={handleFetchDataClick}
      />
      <RequestTable key={state.renderKey} requests={sortedAndFilteredRequests} />
    </>
  );
};

export default App;
