import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import QuestionsService from '../services/QuestionsService';
import Page from '../components/Page';
import QuestionInfo from '../components/QuestionInfo';
import QuestionDefinition from '../interfaces/QuestionDefinition';
import PaginationMetadata from '../interfaces/PaginationMetadata';
import QuestionListResponse from '../interfaces/QuestionListResponse';
import AuthContext from '../contexts/AuthContext';

const useStyles = makeStyles((theme: Theme) => ({
  spacer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  loader: {
    margin: theme.spacing(5, 'auto'),
  },
}));

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<QuestionDefinition[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMetadata, setPaginationMetadata] = useState<
    PaginationMetadata | undefined
  >();
  const [loadingError, setError] = useState<string>();

  const authContext = useContext(AuthContext);

  const changePage = (event: ChangeEvent<unknown>, value: number): void => {
    setPage(value);
  };

  useEffect(() => {
    const limit = process.env.REACT_APP_PAGINATION_LIMIT as unknown as number;

    QuestionsService.getQuestions(page, limit).then(
      (result: QuestionListResponse) => {
        setPaginationMetadata(result.meta);
        setItems(result.data);
        setIsLoading(false);
      },
      (error: Error) => {
        setIsLoading(false);
        setError(error.message);
      }
    );
  }, [page]);

  const classes = useStyles();

  let content;
  if (isLoading) {
    content = <CircularProgress className={classes.loader} />;
  } else if (loadingError || items.length === 0) {
    const message = loadingError || 'No questions in the database';
    content = (
      <Typography variant="body1" color="error" component="p">
        {message}
      </Typography>
    );
  } else {
    content = items.map((item) => (
      <React.Fragment key={item.id}>
        <QuestionInfo
          id={item.id}
          answers={item.answers}
          views={item.views}
          title={item.title}
          date={new Date(item.created_at)}
        />
        <Grid container item xs={12} direction="row">
          <Divider className={classes.spacer} />
        </Grid>
      </React.Fragment>
    ));
  }

  const actions = authContext.loggedIn
    ? [
        {
          label: 'Ask a question',
          link: '/questions/new',
        },
      ]
    : [];

  return (
    <Page title="Last Questions" actions={actions}>
      {content}
      <Grid container item xs={12} direction="row" justifyContent="center">
        <Pagination
          page={paginationMetadata?.current_page || 1}
          count={paginationMetadata?.last_page || 1}
          onChange={changePage}
        />
      </Grid>
    </Page>
  );
};

export default Home;
