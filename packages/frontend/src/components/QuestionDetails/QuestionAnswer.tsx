import * as React from 'react';
import he from 'he';
import {
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import toTimeAgo from '../../helpers/toTimeAgo';
import AuthorDefinition from '../../interfaces/AuthorDefinition';

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

interface QuestionAnswerProps {
  author: AuthorDefinition;
  body: string;
  date: Date;
}

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
  author,
  body,
  date,
}: QuestionAnswerProps) => {
  const classes = useStyles();

  return (
    <Grid container item xs={12} direction="row" className="QuestionAnswer">
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
          {`Answered by ${author.name} - ${toTimeAgo(date)}`}
        </Typography>
      </Grid>
      <Grid container item xs={12} direction="row">
        <Divider className={classes.spacer} />
      </Grid>
    </Grid>
  );
};

export default QuestionAnswer;
