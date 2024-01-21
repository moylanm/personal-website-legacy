import React from 'react';

type FormProps = {
  selectedSortOrder: string;
  selectedAuthor: string;
  uniqueAuthors: string[];
  onSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAuthorChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onRandomClick: () => void;
  onReset: () => void;
};

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
      <label>
        <input type='radio' value='newest' onChange={onSortChange} checked={selectedSortOrder === 'newest'} />
        Newest
      </label>
      <label>
        <input type='radio' value='oldest' onChange={onSortChange} checked={selectedSortOrder === 'oldest'} />
        Oldest
      </label>
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
      <button type='button' onClick={onReset}>Reset</button>
      <div className='divider' />
      <button type='button' onClick={onRandomClick}>Random Excerpt</button>
    </div>
  </form>
);

export default FilterForm;
