import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authLoginApi } from '../store/Slices/authSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full sm:w-1/2 md:w-1/3 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-center text-2xl font-semibold mb-4">Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors }) => (
                        <Form>
                            <div className="mb-4">
                                <Field
                                    name="email"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Email"
                                />
                                {touched.email && errors.email && (
                                    <div className="text-red-500 text-sm">{errors.email}</div>
                                )}
                            </div>

                            <div className="mb-4 relative">
                                <Field
                                    name="password"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                />
                                <div
                                    className="absolute right-2 top-2 cursor-pointer"
                                    onClick={handleClickShowPassword}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                                {touched.password && errors.password && (
                                    <div className="text-red-500 text-sm">{errors.password}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                                >
                                    Login
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-sm">
                                    Don't have an account?{' '}
                                    <NavLink to="/signup" className="text-blue-500">
                                        Sign up here
                                    </NavLink>
                                </p>
                            </div>

                            {message && <p className="text-center text-red-500 mt-4">{message}</p>}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SignIn;
