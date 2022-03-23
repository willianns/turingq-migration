import * as Yup from 'yup';
import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Formik, FormikHelpers } from 'formik';

import FormValidationError from '../errors/FormValidationError';
import Message from '../interfaces/Message';
import QuestionsService from '../services/QuestionsService';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
  },
  message: {
    marginBottom: theme.spacing(4),
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
    margin: theme.spacing(3, 0, 0),
  },
}));

const NewQuestionForm: React.FC = () => {
  const classes = useStyles();

  const formInitialValues = {
    title: '',
    body: '',
  };

  const [message, setMessage] = useState<Message>();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(10, 'The title must be at least 10 characters')
      .required('Please inform a valid title'),
    body: Yup.string()
      .min(20, 'The body must be at least 20 characters')
      .required('Please inform a valid body'),
  });

  const onSubmit = async (
    data: Record<string, string>,
    {
      resetForm,
      setErrors,
      setSubmitting,
    }: FormikHelpers<{ title: string; body: string }>
  ): Promise<void> => {
    setSubmitting(true);
    QuestionsService.saveQuestion(data.title, data.body).then(
      () => {
        setSubmitting(false);
        resetForm();
        setMessage({
          type: 'success',
          body: 'Question saved sucessfully',
        });
      },
      (error: FormValidationError) => {
        if (error.errors) {
          const formErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
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
    <Container component="main">
      <CssBaseline />
      <Paper className={classes.paper}>
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
          {(formProps) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = formProps;
            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      id="title"
                      name="title"
                      autoComplete="title"
                      fullWidth
                      label="Title"
                      required
                      variant="outlined"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.title && touched.title}
                      helperText={errors.title && touched.title && errors.title}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="body"
                      name="body"
                      multiline
                      fullWidth
                      label="Your answer"
                      minRows={10}
                      required
                      variant="outlined"
                      value={values.body}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.body && touched.body}
                      helperText={errors.body && touched.body && errors.body}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  xs
                  direction="row"
                  justifyContent="flex-end"
                >
                  <Button
                    type="submit"
                    className={classes.submit}
                    color="primary"
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
                    Submit
                  </Button>
                </Grid>
              </form>
            );
          }}
        </Formik>
      </Paper>
    </Container>
  );
};

export default NewQuestionForm;
