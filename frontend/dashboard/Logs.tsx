import React, { useCallback, useMemo } from 'react';
import { Action, ActionType, AppState, IPAddress } from './types';
import { clearLogs, fetchLogs } from './api';
import RequestTable from './RequestTable';
import FilterForm from './FilterForm';

type LogsProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Logs: React.FC<LogsProps> = ({
  state,
  dispatch
}) => {
  const handlFetchDataClick = useCallback(() => {
    fetchLogs(dispatch, state.ipAddresses, state.renderKey);
  }, [dispatch, state.ipAddresses, state.renderKey]);

  const handleClearDataClick = useCallback(() => {
    clearLogs(dispatch, state.renderKey);
  }, [dispatch, state.renderKey]);

  const handleIPAddressChange = useCallback((ipToChange: IPAddress) => {
    const ipAddresses = state.ipAddresses.map((ip) => {
      return ip.value === ipToChange.value ? {value: ip.value, selected: !ipToChange.selected} : ip;
    });

    dispatch({
      type: ActionType.SetIPAddresses,
      payload: ipAddresses
    });
  }, [dispatch, state.ipAddresses]);

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
