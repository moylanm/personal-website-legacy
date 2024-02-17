import React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHeaderCell
} from 'semantic-ui-react';
import { Request } from './types';

const RequestTable: React.FC<{ requests: Request[] }> = ({ requests }) => {
  return (
    <Table className='dashboard-table'>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Timestamp</TableHeaderCell>
          <TableHeaderCell>IP Address</TableHeaderCell>
          <TableHeaderCell>Method</TableHeaderCell>
          <TableHeaderCell>Path</TableHeaderCell>
          <TableHeaderCell>Referer</TableHeaderCell>
          <TableHeaderCell>UA Name</TableHeaderCell>
          <TableHeaderCell>UA OS</TableHeaderCell>
          <TableHeaderCell>UA Device Type</TableHeaderCell>
          <TableHeaderCell>UA Device Name</TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {requests.map((request) => <Row key={request.id} request={request} />)}
      </TableBody>
    </Table>
  );
};

const Row: React.FC<{ request: Request }> = ({ request }) => {
  return (
    <TableRow>
      <TableCell>{formatDate(request.timestamp)}</TableCell>
      <TableCell>{request.ipAddress}</TableCell>
      <TableCell>{request.method}</TableCell>
      <TableCell>{request.path}</TableCell>
      <TableCell>{request.referer}</TableCell>
      <TableCell>{request.uaName}</TableCell>
      <TableCell>{request.uaOS}</TableCell>
      <TableCell>{request.uaDeviceType}</TableCell>
      <TableCell>{request.uaDeviceName}</TableCell>
    </TableRow>
  );
};

const formatDate = (dateString: string) => {
  return Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false
  }).format(Date.parse(dateString));
};

export default RequestTable;
