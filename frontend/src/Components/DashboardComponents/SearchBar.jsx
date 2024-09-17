import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch user suggestions based on the query
  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return; // Don't fetch if query is less than 3 characters
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/search/?query=${searchQuery}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${document.cookie.replace(
              /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
              '$1'
            )}`, // assuming token is stored in a cookie
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.users);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change and trigger search
  const handleInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    fetchSuggestions(searchQuery);
  };

  // Handle user selection from the suggestions list
  const handleSelectUser = (user) => {
    setQuery(user.fullname); // Set input to the selected user's name
    setSuggestions([]); // Clear suggestions after selection
    onSelectUser(user); // Pass selected user to parent component
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by enrollment number or name..."
        value={query}
        onChange={handleInputChange}
        className="search-input w-full p-4"
      />
      {loading && <div>Loading...</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((user) => (
            <li key={user.userId} onClick={() => handleSelectUser(user)}>
              {user.fullname} - {user.userId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
