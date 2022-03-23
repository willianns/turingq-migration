import * as Yup from 'yup';
import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Link,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Alert } from '@material-ui/lab';
import { Formik, FormikHelpers } from 'formik';

import { Link as RouterLink } from 'react-router-dom';

import SignUpService from '../services/SignUpService';
import SignUpResponse from '../interfaces/SignUpResponse';
import FormValidationError from '../errors/FormValidationError';
import Message from '../interfaces/Message';
import FormItemValidationError from '../interfaces/FormItemValidationError';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(4),
  },
  message: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  progress: {
    marginRight: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUpForm: React.FC = () => {
  const classes = useStyles();

  const formInitialValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  const [message, setMessage] = useState<Message>();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please inform a valid name'),
    email: Yup.string()
      .email('Please inform a valid email')
      .required('Please inform a valid email'),
    password: Yup.string()
      .min(8, 'The password must be at least 8 characters')
      .required('Please inform a valid password'),
    password_confirmation: Yup.string()
      .min(8, 'The password must be at least 8 characters')
      .required('Please confirm your password')
      .when('password', {
        is: (val: string) => val && val.length > 0,
        then: Yup.string().oneOf(
          [Yup.ref('password')],
          'The informed passwords do not match'
        ),
      }),
  });

  const onSubmit = async (
    data: Record<string, string>,
    {
      resetForm,
      setErrors,
      setSubmitting,
    }: FormikHelpers<{
      name: string;
      email: string;
      password: string;
      // eslint-disable-next-line camelcase
      password_confirmation: string;
    }>
  ): Promise<void> => {
    setSubmitting(true);
    SignUpService.signUp(
      data.name,
      data.email,
      data.password,
      data.password_confirmation
    ).then(
      // eslint-disable-next-line no-unused-vars
      (resp: SignUpResponse) => {
        setSubmitting(false);
        resetForm();
        setMessage({
          type: 'success',
          body: 'User signed up successfully!',
        });
      },
      (error: FormValidationError) => {
        if (error.errors) {
          const formErrors: Record<string, string> = {};
          error.errors.forEach((err: FormItemValidationError) => {
            formErrors[err.field] = err.message;
          });
          setErrors(formErrors);
        } else {
          setMessage({
            type: 'error',
            body: error.message,
          });
        }
        setSubmitting(false);
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        {message && (
          <Alert className={classes.message} severity={message.type}>
            {message.body}
          </Alert>
        )}

        <Formik
          initialValues={formInitialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props;
            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      id="name"
                      name="name"
                      autoComplete="fullname"
                      autoFocus
                      fullWidth
                      label="Full Name"
                      required
                      variant="outlined"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.name && touched.name}
                      helperText={errors.name && touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="email"
                      name="email"
                      autoComplete="email"
                      fullWidth
                      label="Email Address"
                      required
                      variant="outlined"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.email && touched.email}
                      helperText={errors.email && touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      fullWidth
                      label="Password"
                      required
                      variant="outlined"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.password && touched.password}
                      helperText={
                        errors.password && touched.password && errors.password
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      fullWidth
                      label="Confirm your password"
                      required
                      variant="outlined"
                      value={values.password_confirmation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        !!errors.password_confirmation &&
                        touched.password_confirmation
                      }
                      helperText={
                        errors.password_confirmation &&
                        touched.password_confirmation &&
                        errors.password_confirmation
                      }
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  className={classes.submit}
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <CircularProgress
                      className={classes.progress}
                      size={20}
                      color="secondary"
                    />
                  )}
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link component={RouterLink} to="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </form>
            );
          }}
        </Formik>
      </Paper>
    </Container>
  );
};

export default SignUpForm;
