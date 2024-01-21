import React from 'react';

type FormProps = {
  selectedAuthor: string;
  uniqueAuthors: string[];
  onAuthorChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const FilterForm: React.FC<FormProps> = ({
  selectedAuthor,
  uniqueAuthors,
  onAuthorChange
}) => (
  <form>
    <label htmlFor='authorSelect'>Authors:</label>
    <select id='authorSelect' value={selectedAuthor} onChange={onAuthorChange}>
      <option value=''>Any</option>
      {uniqueAuthors.map(author => (
        <option key={author} value={author}>
          {author}
        </option>
      ))}
    </select>
  </form>
);

export default FilterForm;
