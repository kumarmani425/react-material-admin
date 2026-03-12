// CoconutCategoryForm.js
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Grid, AppBar, Toolbar, Typography, Box, Card, CardContent } from '@mui/material';
import Fieldset from '../Fieldset/Fieldset';
import { DataGrid } from '@mui/x-data-grid';
import DataGridComponent from '../DataGrid/DataGridComponent';

import { getApiCall, postApiCall, getApiCallWithParams } from '../../../src/nest_api'; // Adjust the path as needed
import { get, set } from 'lodash';

const CoconutCategoryForm = ({ defaultValues }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: defaultValues || {
            c_name: '',
            description: '',
            size_grade: '',
            quality_grade: '',
            status: 1,
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await postApiCall('/coconut-categories', data);
            console.log('API Response:', response);
            // Handle success (e.g., show a success message, redirect, etc.)
            getCategoriesList(); // Refresh the categories list after adding a new category
            reset(); // Reset the form fields after successful submission

        } catch (error) {
            console.error('Error submitting form:', error);
        }

        // Here you can handle the form submission, e.g., send data to an API
    };

    const getCategoriesList = async () => {
        // Fetch the list of categories from your API and set it to state
        try {
            const response = await getApiCall('/coconut-categories/getCategoriesList')
            console.log('cotagi', response)
            setCategories(response) // Assuming response.data contains the list of categories
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        getCategoriesList()
    }, []);


    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'c_name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 250 },
        { field: 'size_grade', headerName: 'Size Grade', width: 150 },
        { field: 'quality_grade', headerName: 'Quality Grade', width: 150 },
        { field: 'status', headerName: 'Status', width: 120 },
        /*  {
             field: 'actions',
             headerName: 'Actions',
             width: 180,
             renderCell: (params) => (
                 <>
                     <button onClick={() => handleEdit(params.row)}>Edit</button>
                     <button onClick={() => handleDelete(params.row.id)}>Delete</button>
                 </>
             ),
         }, */
    ];




    const handleEdit = (category) => {
        console.log('Edit category', category);
        // You can open a dialog with CoconutCategoryForm prefilled
    };

    const handleDelete = (id) => {
        setCategories(categories.filter((c) => c.id !== id));
    };


    return (
        <>
            <AppBar position="static" sx={{ textTransform: "capitalize", borderRadius: '8px 8px 0 0' }}>
                <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Create Coconut Category
                    </Typography></Toolbar></AppBar>
            <Box >
                <Card variant="outlined" spacing={2} sx={{ minWidth: '50%', p: 2 }}>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Controller
                                        name="c_name"
                                        control={control}
                                        rules={{
                                            required: 'Category name is required', validate: async (value) => {
                                                if (!value) return true;

                                                try {
                                                    console.log('Validating category name:', value);
                                                    const res = await getApiCallWithParams(`coconut-categories/checkCategoryName/${encodeURIComponent(value)}`);
                                                    console.log("ers", res)
                                                    if (res && (res.exists === true || res.user)) {
                                                        return 'Category name already exists';
                                                    }
                                                    return true;
                                                } catch (err) {
                                                    console.log('err', err)
                                                    return 'Error validating Category name';
                                                }
                                            },
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Category Name"
                                                fullWidth
                                                size='small'
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Controller
                                        name="description"
                                        control={control}
                                        rules={{ required: 'Description is required' }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Description"
                                                fullWidth
                                                size='small'
                                                multiline
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Controller
                                        name="size_grade"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} size='small' label="Size Grade" fullWidth />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Controller
                                        name="quality_grade"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} size='small' label="Quality Grade" fullWidth />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>

                    </CardContent>
                </Card>
            </Box>
            <br></br>
            <AppBar position="static" sx={{ textTransform: "capitalize", borderRadius: '8px 8px 0 0' }}>
                <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Category List
                    </Typography></Toolbar></AppBar>
            <Box >
                <Card variant="outlined" spacing={2} sx={{ minWidth: '50%', p: 2 }}>
                    <CardContent>
                        <DataGridComponent pageLink={'title'} tableData={categories} columns={columns} loading={loading} />
                    </CardContent>
                </Card>
            </Box>

        </>
    );
};

export default CoconutCategoryForm;