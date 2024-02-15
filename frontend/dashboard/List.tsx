import React from 'react';
import { Request } from './types';

const List: React.FC<{ requests: Request[] }> = ({ requests }) => {
  return requests.map((request) => <Item key={request.id} request={request} />)
};

const Item: React.FC<{ request: Request }> = ({ request }) => {
  return (
    <pre>{JSON.stringify(request, null, 2)}</pre>
  );
};

export default List;
