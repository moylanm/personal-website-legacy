import React from 'react';

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
  selectedSortOrder: boolean;
  ipAddresses: string[];
  onSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onIPAddrChange: (event: React.FormEvent<HTMLInputElement>) => void;
};

const FilterForm: React.FC<FormProps> = ({
  selectedSortOrder,
  ipAddresses,
  onSortChange,
  onIPAddrChange
}) => (
  <form>
    <fieldset>
      <label>Sort By:</label>
      <RadioButton value='newest' checked={!selectedSortOrder} onChange={onSortChange} label='Newest' />
      <RadioButton value='oldest' checked={selectedSortOrder} onChange={onSortChange} label='Oldest' />
    </fieldset>
    <label>IP Address:</label>
    <div className='scrollable-list'>
      {ipAddresses.map(ipAddress => (
        <label key={ipAddress}>
          <input type='checkbox' value={ipAddress} onChange={onIPAddrChange} defaultChecked />
          <div className='divider' />
          {ipAddress}
        </label>
      ))}
    </div>
  </form>
);

export default FilterForm;
