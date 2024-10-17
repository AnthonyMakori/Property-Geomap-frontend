import React, {SyntheticEvent, useState} from 'react';
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text} from "@mantine/core";
import { debounce } from 'lodash'; // Import debounce from lodash

function List() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
    // Debounce the search term input
    const debouncedSearch = debounce((value) => setDebouncedSearchTerm(value), 500);
  
    const handleSearchTermChange = (e) => {
      const { value } = e.target;
      setSearchTerm(value);
      debouncedSearch(value); // Debounced search term
    };


    return (

        <TextInput
            label="Search"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchTermChange}
        />

    );
}

export default List;
