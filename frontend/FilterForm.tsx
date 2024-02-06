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
  selectedAuthor: string;
  selectedWork: string;
  uniqueAuthors: string[];
  authorWorks: { [author: string]: string[] }
  onSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAuthorChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onWorkChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onRandomClick: () => void;
  onReset: () => void;
};

const FilterForm: React.FC<FormProps> = ({
  selectedSortOrder,
  selectedAuthor,
  selectedWork,
  uniqueAuthors,
  authorWorks,
  onSortChange,
  onAuthorChange,
  onWorkChange,
  onRandomClick,
  onReset
}) => (
  <form>
    <fieldset>
      <label>Sort By:</label>
      <RadioButton value='newest' checked={!selectedSortOrder} onChange={onSortChange} label='Newest' />
      <RadioButton value='oldest' checked={selectedSortOrder} onChange={onSortChange} label='Oldest' />
    </fieldset>
    <div className='dropdown-container'>
      <fieldset className='author-dropdown'>
        <label htmlFor='authorSelect'>Author:</label>
        <select id='authorSelect' value={selectedAuthor} onChange={onAuthorChange}>
          <option value=''>Any</option>
          {uniqueAuthors.map(author => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </fieldset>
      {selectedAuthor && (
        <fieldset>
          <label htmlFor='workSelect'>Work:</label>
          <select id='workSelect' value={selectedWork} onChange={onWorkChange}>
            <option value=''>Any</option>
            {authorWorks[selectedAuthor].map(work => (
              <option key={work} value={work}>
                {work}
              </option>
            ))}
          </select>
        </fieldset>
      )}
    </div>
    <div>
      <button type='button' onClick={onRandomClick} aria-label='Select a random excerpt'>Random Excerpt</button>
      <div className='divider' />
      <button type='button' onClick={onReset} aria-label='Reset filters'>Reset</button>
    </div>
  </form>
);

export default FilterForm;
