import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Box, Card, CardContent, IconButton, InputAdornment } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authLoginApi } from '../store/Slices/authSlice';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const Login = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        email: '',
        password: '',
    };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            dispatch(authLoginApi(values)).then(action => {
                if (action.meta.requestStatus === 'fulfilled') {
                    navigate('/');
                } else if (action.meta.requestStatus === 'rejected') {
                    const errors = action?.payload?.errors ?? {};
                    const message = action?.payload?.message ?? '';
                    const status = action?.payload?.status ?? '';
                    if (status === 422) {
                        const formErrors = Object.keys(errors).reduce((acc, key) => {
                            acc[key] = errors[key][0]; // Display the first error message for each field
                            return acc;
                        }, {});
                        setErrors(formErrors);
                    } else if (status === 410) {
                        setMessage(message || 'An Error occured');
                    }
                }
            });
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Grid2 container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
            <Grid2 item size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                    <CardContent sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Login
                        </Typography>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, touched, errors }) => (
                                <Form>
                                    <Grid2 container spacing={2} direction="column">
                                        <Grid2 item size={12}>
                                            <Field
                                                name="email"
                                                as={TextField}
                                                label="Email"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                helperText={<ErrorMessage name="email" />}
                                                error={touched?.email && errors?.email}
                                            />
                                        </Grid2>

                                        <Grid2 item xs={12}>
                                            <Field
                                                name="password"
                                                as={TextField}
                                                label="Password"
                                                fullWidth
                                                type={showPassword ? 'text' : 'password'}
                                                variant="outlined"
                                                size="small"
                                                helperText={<ErrorMessage name="password" />}
                                                error={touched?.password && errors?.password}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleClickShowPassword}
                                                                edge="end"
                                                                aria-label="toggle password visibility"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid2>

                                        <Grid2 item xs={12}>
                                            <Button type="submit" variant="contained" color="primary" fullWidth size="small">
                                                Login
                                            </Button>
                                        </Grid2>
                                        <Typography variant='body2'>Not have an account <NavLink to={'/signup'} replace={true}>signup here</NavLink></Typography>
                                        {message ? (
                                            <Typography variant='body2' color='error'>{message}</Typography>
                                        ) : null}
                                    </Grid2>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>
    );
};

export default Login;
