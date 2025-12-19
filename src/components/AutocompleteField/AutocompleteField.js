import React from 'react';
import { useField } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const AutocompleteField = ({ name, label, options, ...props }) => {
    const {
        input,
        meta: { touched, error },
    } = useField(name);

    return (
        <Autocomplete
            {...props}
            options={options}
            getOptionLabel={(option) => option.label}
            value={input.value}
            onChange={(_, value) => input.onChange(value)}
            onBlur={input.onBlur}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={touched && !!error}
                    helperText={touched && error}
                />
            )}
        />
    );
};

export default AutocompleteField;