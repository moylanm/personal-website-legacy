import React, { useCallback, useMemo } from 'react';
import { Action, ActionType, AppState } from './types';
import RequestTable from './RequestTable';
import FilterForm from './FilterForm';
import { clearLogs, fetchLogs } from './api';

type LogsProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Logs: React.FC<LogsProps> = ({
  state,
  dispatch
}) => {

  const handlFetchDataClick = () => {
    fetchLogs(dispatch, state.ipAddresses, state.renderKey);
  };

  const handleClearDataClick = () => {
    clearLogs(dispatch, state.renderKey);
  };

  const handleIPAddressChange = (value: string, selected: boolean) => {
    const ipAddresses = state.ipAddresses.map((ip) => {
      return ip.value === value ? {value: ip.value, selected: !selected} : ip;
    });


    dispatch({
      type: ActionType.SetIPAddresses,
      payload: ipAddresses
    });
  };

  const filteredRequests = useMemo(() => {
    const selectedIPs = state.ipAddresses
      .filter((ip) => ip.selected)
      .map((ip) => ip.value);

    return state.requests.filter((request) =>
      selectedIPs.includes(request.ipAddress)
    );
  }, [state.requests, state.ipAddresses]);

  return (
    <>
      {(state.fetchError || state.clearError) ?? <div className='error-message'>{state.errorMessage}</div>}
      <FilterForm 
        renderKey={state.renderKey}
        ipAddresses={state.ipAddresses}
        onIPAddrChange={handleIPAddressChange}
        onFetchDataClick={handlFetchDataClick}
        onClearDataClick={handleClearDataClick}
      />
      {filteredRequests.length > 0
        ? <RequestTable key={state.renderKey} requests={filteredRequests} />
        : <div className='message'>No logs to render...</div>
      }
    </>
  );
};

export default Logs;
