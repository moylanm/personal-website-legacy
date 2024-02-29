import React from 'react';
import { Request } from './types';
import { formatDate } from './utils';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledTableContainer } from './styled';

interface Column {
  id: 'timestamp' | 'method' | 'path' | 'ipAddress' | 'referer' | 'uaName' | 'uaOS' | 'uaDeviceType' | 'uaDeviceName';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?:(value: string) => string;
}

const columns: readonly Column[] = [
  { 
    id: 'timestamp',
    label: 'Timestamp',
    format: (value: string) => formatDate(value)
  },
  {
    id: 'ipAddress',
    label: 'IP Address',
    minWidth: 94
  },
  {
    id: 'method',
    label: 'Method'
  },
  {
    id: 'path',
    label: 'Path',
    minWidth: 72
  },
  {
    id: 'referer',
    label: 'Referer',
    minWidth: 192
  },
  {
    id: 'uaName',
    label: 'UA Name',
    align: 'right'
  },
  {
    id: 'uaOS',
    label: 'UA OS',
    align: 'right'
  },
  {
    id: 'uaDeviceType',
    label: 'UA Device Type',
    align: 'right'
  },
  {
    id: 'uaDeviceName',
    label: 'UA Device Name',
    align: 'right'
  }
];

const RequestTable: React.FC<{ requests: Request[] }> = ({ requests }) => {
  return (
    <StyledTableContainer>
      <Table className='dashboard-table'>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => <Row request={request} />)}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

const Row: React.FC<{ request: Request }> = ({ request }) => {
  return (
    <TableRow key={request.id}>
      {columns.map((column) => {
        const value = request[column.id];
        return (
          <TableCell key={column.id} align={column.align}>
            {column.format ? column.format(value) : value}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default RequestTable;
