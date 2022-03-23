import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  CircularProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import Page from '../components/Page';
import QuestionDefinition from '../interfaces/QuestionDefinition';
import QuestionsService from '../services/QuestionsService';
import QuestionDetails from '../components/QuestionDetails';

const useStyles = makeStyles((theme: Theme) => ({
  loader: {
    margin: theme.spacing(5, 'auto'),
  },
}));

const actions = [
  {
    label: 'All questions',
    link: '/',
  },
];

const Question: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setError] = useState<string>();
  const [question, setQuestion] = useState<QuestionDefinition | null>(null);

  const loadQuestion = (questionId: string): void => {
    setIsLoading(true);

    QuestionsService.getQuestion(questionId).then(
      (result: QuestionDefinition) => {
        setQuestion(result);
        setIsLoading(false);
      },
      (error: Error) => {
        setIsLoading(false);
        setError(error.message);
      }
    );
  };

  useEffect(() => {
    loadQuestion(id);
  }, [id]);

  const classes = useStyles();

  let content;
  if (isLoading) {
    content = <CircularProgress className={classes.loader} />;
  } else if (loadingError || !question) {
    const message = loadingError || 'This question could not be loaded';
    content = (
      <Typography variant="body1" color="error" component="p">
        {message}
      </Typography>
    );
  } else {
    content = (
      <QuestionDetails
        id={question.id}
        author={question.author}
        answers={question.answers}
        views={question.views}
        body={question.body}
        date={new Date(question.created_at)}
        onQuestionSave={() => loadQuestion(id)}
      />
    );
  }

  return (
    <Page title={question?.title} actions={actions}>
      {content}
    </Page>
  );
};

export default Question;
