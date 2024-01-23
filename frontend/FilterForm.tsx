import React from 'react';

type FormProps = {
  selectedSortOrder: boolean;
  selectedAuthor: string;
  uniqueAuthors: string[];
  onSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAuthorChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onRandomClick: () => void;
  onReset: () => void;
};

const RadioButton: React.FC<{
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}> = ({ value, checked, onChange, label }) => (
  <label>
    <input type="radio" value={value} onChange={onChange} checked={checked} id={value} />
    <div className='divider' />
    {label}
  </label>
);

const FilterForm: React.FC<FormProps> = ({
  selectedSortOrder,
  selectedAuthor,
  uniqueAuthors,
  onSortChange,
  onAuthorChange,
  onRandomClick,
  onReset
}) => (
  <form>
    <div>
      <label>Sort By:</label>
      <RadioButton value='newest' checked={!selectedSortOrder} onChange={onSortChange} label='Newest' />
      <RadioButton value='oldest' checked={selectedSortOrder} onChange={onSortChange} label='Oldest' />
    </div>
    <div>
      <label htmlFor='authorSelect'>Author:</label>
      <select id='authorSelect' value={selectedAuthor} onChange={onAuthorChange}>
        <option value=''>Any</option>
        {uniqueAuthors.map(author => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>
    </div>
    <div>
      <button type='button' onClick={onRandomClick} aria-label='Select a random excerpt'>Random Excerpt</button>
      <div className='divider' />
      <button type='button' onClick={onReset} aria-label='Reset filters'>Reset</button>
    </div>
  </form>
);

export default FilterForm;
