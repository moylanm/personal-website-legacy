import React, { useCallback, useMemo } from 'react';
import { Action, ActionType, IPAddress, Request } from './types';
import { clearLogs, fetchLogs } from './api';
import RequestTable from './RequestTable';
import FilterForm from './FilterForm';

type LogsProps = {
  dispatch: React.Dispatch<Action>;
  renderKey: number;
  requests: Request[];
  ipAddresses: IPAddress[];
}

const Logs: React.FC<LogsProps> = ({
  dispatch,
  renderKey,
  requests,
  ipAddresses
}) => {
  const handlFetchLogsClick = useCallback(() => {
    fetchLogs(dispatch, ipAddresses, renderKey);
  }, [dispatch, ipAddresses, renderKey]);

  const handleClearLogsClick = useCallback(() => {
    clearLogs(dispatch, renderKey);
  }, [dispatch, renderKey]);

  const handleIPAddressChange = useCallback((ipToChange: IPAddress) => {
    const newIPAddressState = ipAddresses.map((ip) => {
      return ip.value === ipToChange.value ? {value: ip.value, selected: !ipToChange.selected} : ip;
    });

    dispatch({
      type: ActionType.SetIPAddresses,
      payload: newIPAddressState
    });
  }, [dispatch, ipAddresses]);

  const filteredRequests = useMemo(() => {
    const selectedIPs = ipAddresses
    .filter((ip) => ip.selected)
    .map((ip) => ip.value);

    return requests.filter((request) =>
      selectedIPs.includes(request.ipAddress)
    );
  }, [requests, ipAddresses]);

  return (
    <>
      <FilterForm 
        ipAddresses={ipAddresses}
        onIPAddrChange={handleIPAddressChange}
        onFetchDataClick={handlFetchLogsClick}
        onClearDataClick={handleClearLogsClick}
      />
      {filteredRequests.length > 0
        ? <RequestTable key={renderKey} requests={filteredRequests} />
        : <div className='message'>No logs to render...</div>
      }
    </>
  );
};

export default Logs;
