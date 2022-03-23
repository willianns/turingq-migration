import * as React from 'react';
import he from 'he';
import {
  Card,
  CardContent,
  Grid,
  Link,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import toTimeAgo from '../helpers/toTimeAgo';
import AnswerDefinition from '../interfaces/AnswerDefinition';

interface QuestionProps {
  id: string;
  answers: AnswerDefinition[];
  views: number;
  title: string;
  date: Date;
}

const useStyles = makeStyles((theme: Theme) => ({
  questionRow: {
    flexWrap: 'nowrap',
  },
  statistic: {
    flexGrow: 0,
    flexShrink: 0,
    width: '95px',
    marginRight: theme.spacing(2),
    textAlign: 'center',
  },
  mainInfo: {
    flexGrow: 1,
    flexShrink: 1,
    textAlign: 'right',
  },
}));

const Question: React.FC<QuestionProps> = ({
  id,
  answers,
  date,
  title,
  views,
}: QuestionProps) => {
  const classes = useStyles();

  return (
    <Grid
      container
      item
      xs={12}
      direction="row"
      className={classes.questionRow}
    >
      <Card variant="outlined" className={classes.statistic}>
        <CardContent>
          <Typography variant="body1" color="textSecondary" component="p">
            {answers.length}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            answers
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" className={classes.statistic}>
        <CardContent>
          <Typography variant="body1" color="textSecondary" component="p">
            {views}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            views
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" className={classes.mainInfo}>
        <CardContent>
          <Link component={RouterLink} to={`/questions/${id}`} variant="h5">
            {he.decode(title)}
          </Link>
          <Typography color="textSecondary" variant="body2">
            {toTimeAgo(date)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Question;
