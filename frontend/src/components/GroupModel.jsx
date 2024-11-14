import {
  Avatar,
  Box,
  Button,
  Modal,
  Typography,
  Grid,
  Divider,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import useWindowWidth from '../../hooks/window';
import { userListApi } from '../store/Slices/authSlice';
import { groupCreateApi, OpenGroupModel } from '../store/Slices/chatSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Group Name is required'),
  participants: Yup.array().required('Participants are required'),
});

const GroupModel = () => {
  const width = useWindowWidth();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const isOpenGroupModel = useSelector((state) => state.chat.isOpenGroupModel);
  const isUserList = useSelector((state) => state.auth.isUserList);

  // State to track selected user IDs
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userName, setUserName] = useState('');

  const initialValues = {
    name: '',
    participants: [],
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log('values: ', values);
    try {
      dispatch(groupCreateApi(values)).then(action => {
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: width > 768 ? 600 : width > 567 ? '80%' : '90%',
    boxShadow: 24,
    borderRadius: 4,
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    height: width > 768 ? '70vh' : '80vh',
  };

  // Fetch user list dynamically
  useEffect(() => {
    dispatch(userListApi({ name: userName }));
  }, [userName, dispatch]);

  // Toggle user selection
  const toggleUserSelection = (userId, setFieldValue) => {
    let updatedSelection;

    if (selectedUsers.includes(userId)) {
      // Remove user if already selected
      updatedSelection = selectedUsers.filter((id) => id !== userId);
    } else {
      // Add user if not selected
      updatedSelection = [...selectedUsers, userId];
    }

    setSelectedUsers(updatedSelection);
    setFieldValue('participants', updatedSelection); // Update Formik's `participants` array
  };

  return (
    <Modal
      open={isOpenGroupModel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, touched, errors, values }) => {
          console.log('values: ', values);
          return (
            <Form>
              <Box sx={style}>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #ddd',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="h6" component="h2">
                    Create Group
                  </Typography>
                  <Typography sx={{ mt: 1, mb: 1 }}>
                    Create Group - Select Users to include
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 2,
                  }}
                >

                  <Grid container spacing={2}>
                    <Grid xs={12} pl={2} py={2}>
                      <Field
                        name="name"
                        as={TextField}
                        label="Group Name"
                        fullWidth
                        variant="outlined"
                        size="small"
                        helperText={<ErrorMessage name="name" />}
                        error={touched?.name && errors?.name}
                      />
                    </Grid>
                    <Grid xs={12} pl={2} pb={2}>
                      <TextField
                        fullWidth
                        value={userName}
                        variant="outlined"
                        size="small"
                        label="Search User"
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </Grid>
                    {isUserList && isUserList?.length > 0 ? isUserList?.map((user) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={user._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          padding: 1,
                          cursor: 'pointer',
                          overflowX: 'hidden',
                          backgroundColor: selectedUsers.includes(user._id)
                            ? '#f0f0f0'
                            : 'transparent',
                        }}
                        onClick={() => toggleUserSelection(user._id, setFieldValue)}
                      >
                        <Avatar>{user.user_name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body1">{user.user_name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Grid>
                    )) : (
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2,
                          padding: 1,
                          overflowX: 'hidden',
                        }}
                      >
                        <Avatar>N/A</Avatar>
                        <Box>
                          <Typography variant="body1">No User Found</Typography>
                          <Typography variant="body2" color="textSecondary">
                            No user found by this name
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                </Box>
                <Divider />
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    flexShrink: 0,
                  }}
                >
                  {message ? (
                    <Typography variant='body2' color='error'>{message}</Typography>
                  ) : null}
                  <Button
                    variant="outlined"
                    sx={{
                      background: '#1C252E',
                      color: '#FFF',
                      borderColor: '#1C252E',
                      '&:hover': {
                        borderColor: '#1C252E',
                        background: '#FFF',
                        color: '#1C252E',
                      },
                    }}
                    onClick={() => dispatch(OpenGroupModel(false))}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="outlined"
                    sx={{
                      background: '#3bb77e',
                      color: '#FFF',
                      borderColor: '#3bb77e',
                      '&:hover': {
                        borderColor: '#3bb77e',
                        background: '#FFF',
                        color: '#3bb77e',
                      },
                    }}
                  >
                    Create
                  </Button>
                </Box>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  );
};

export default GroupModel;
