import React, { useContext } from 'react';
import he from 'he';
import {
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import toTimeAgo from '../../helpers/toTimeAgo';
import QuestionAnswer from './QuestionAnswer';
import AuthorDefinition from '../../interfaces/AuthorDefinition';
import AnswerDefinition from '../../interfaces/AnswerDefinition';
import AuthContext from '../../contexts/AuthContext';
import YourAnswer from './YourAnswer';

const useStyles = makeStyles((theme: Theme) => ({
  questionBody: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  spacer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}));

interface QuestionDetailsProps {
  id: string;
  author: AuthorDefinition;
  answers: AnswerDefinition[];
  views: number;
  body: string;
  date: Date;
  onQuestionSave: () => void;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  id,
  author,
  answers,
  views,
  body,
  date,
  onQuestionSave,
}: QuestionDetailsProps) => {
  const classes = useStyles();
  const authContext = useContext(AuthContext);

  return (
    <Grid container item xs={12} direction="row" className="QuestionDetails">
      <Grid item xs={12} className={classes.questionBody}>
        {body
          .replace('\r', '')
          .split('\n')
          .map((paragraph, index) => (
            <Typography
              key={index}
              color="textPrimary"
              component="p"
              align="justify"
              paragraph
            >
              {he.decode(paragraph)}
            </Typography>
          ))}
      </Grid>
      <Grid item xs={12}>
        <Typography color="primary" component="p" align="right">
          {`Asked by ${author.name} - ${toTimeAgo(date)}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          color="textSecondary"
          component="p"
          align="right"
          gutterBottom
        >
          {views} views
        </Typography>
      </Grid>
      <Grid container item xs={12} direction="row">
        <Divider className={classes.spacer} />
      </Grid>
      <Grid item xs={12}>
        <Typography
          color="textPrimary"
          component="h2"
          variant="h5"
          gutterBottom
        >
          {answers.length} answers
        </Typography>
      </Grid>
      {answers.map((answer) => (
        <QuestionAnswer
          key={answer.id}
          author={answer.author}
          body={answer.body}
          date={new Date(answer.created_at)}
        />
      ))}
      {authContext.loggedIn && (
        <YourAnswer questionId={id} onQuestionSave={onQuestionSave} />
      )}
    </Grid>
  );
};

export default QuestionDetails;
