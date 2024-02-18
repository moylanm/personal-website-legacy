import React from 'react';
import { IPAddress } from './types';

type RadioButtonProps = {
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  checked,
  onChange,
  label
}) => (
  <label>
    <input type="radio" value={value} onChange={onChange} checked={checked} id={value} />
    <div className='divider' />
    {label}
  </label>
);

type FormProps = {
  renderKey: number;
  selectedSortOrder: boolean;
  ipAddresses: IPAddress[];
  onSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onIPAddrChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onFetchDataClick: () => void;
};

const FilterForm: React.FC<FormProps> = ({
  renderKey,
  selectedSortOrder,
  ipAddresses,
  onSortChange,
  onIPAddrChange,
  onFetchDataClick
}) => (
  <form>
    <fieldset>
      <label
        >Sort By:
        <RadioButton value='newest' checked={!selectedSortOrder} onChange={onSortChange} label='Newest' />
        <RadioButton value='oldest' checked={selectedSortOrder} onChange={onSortChange} label='Oldest' />
      </label>
    </fieldset>
    <label>
      IP Addresses:
      <div key={renderKey} className='scrollable-list'>
        {ipAddresses.map(ipAddress => (
          <label key={ipAddress.value}>
            <input id={ipAddress.value} type='checkbox' value={ipAddress.value} onChange={onIPAddrChange} checked={ipAddress.selected} />
            <div className='divider' />
            {ipAddress.value}
          </label>
        ))}
      </div>
    </label>
    <div>
      <button type='button' onClick={onFetchDataClick}>Refetch Data</button>
    </div>
  </form>
);

export default FilterForm;
