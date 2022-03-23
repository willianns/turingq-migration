import * as Yup from 'yup';
import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { Formik, FormikHelpers } from 'formik';

import { Alert } from '@material-ui/lab';
import Message from '../../interfaces/Message';
import AnswersService from '../../services/AnswersService';
import FormValidationError from '../../errors/FormValidationError';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(4),
  },
  message: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  progress: {
    marginRight: theme.spacing(2),
  },
  questionBody: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  spacer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface YourAnswerProps {
  onQuestionSave: () => void;
  questionId: string;
}

const YourAnswer: React.FC<YourAnswerProps> = ({
  onQuestionSave,
  questionId,
}: YourAnswerProps) => {
  const classes = useStyles();
  const [message, setMessage] = useState<Message>();

  const formInitialValues = {
    body: '',
  };

  const validationSchema = Yup.object().shape({
    body: Yup.string()
      .required('Please fill the answer')
      .min(20, 'Your answer should have at least 20 characters'),
  });

  const onSubmit = async (
    data: Record<string, string>,
    { setErrors, setSubmitting }: FormikHelpers<{ body: string }>
  ): Promise<void> => {
    setSubmitting(true);
    AnswersService.saveAnswer(questionId, data.body).then(
      () => {
        setSubmitting(false);
        onQuestionSave();
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
    <Container component="div" className="YourAnswer">
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
              <Grid container>
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
              </Grid>
            </form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default YourAnswer;
