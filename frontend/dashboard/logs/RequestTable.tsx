import React from 'react';
import { Request } from './types';
import { formatDate } from './utils';

const RequestTable: React.FC<{ requests: Request[] }> = ({ requests }) => {
  return (
    <table className='dashboard-table'>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>IP Address</th>
          <th>Method</th>
          <th>Path</th>
          <th>Referer</th>
          <th>UA Name</th>
          <th>UA OS</th>
          <th>UA Device Type</th>
          <th>UA Device Name</th>
        </tr>
      </thead>

      <tbody>
        {requests.map((request) => <Row key={request.id} request={request} />)}
      </tbody>
    </table>
  );
};

const Row: React.FC<{ request: Request }> = ({ request }) => {
  return (
    <tr>
      <td>{formatDate(request.timestamp)}</td>
      <td>{request.ipAddress}</td>
      <td>{request.method}</td>
      <td>{request.path}</td>
      <td>{request.referer}</td>
      <td>{request.uaName}</td>
      <td>{request.uaOS}</td>
      <td>{request.uaDeviceType}</td>
      <td>{request.uaDeviceName}</td>
    </tr>
  );
};

export default RequestTable;
