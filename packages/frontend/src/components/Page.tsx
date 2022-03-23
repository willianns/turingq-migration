import * as React from 'react';
import he from 'he';
import {
  Button,
  Container,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    marginBottom: theme.spacing(3),
  },
  container: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(3),
  },
}));

interface PageProps {
  title?: string;
  children?: React.ReactNode;
  actions?: {
    label: string;
    link: string;
  }[];
}

const Page: React.FC<PageProps> = ({ title, children, actions }: PageProps) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container direction="row" justifyContent="space-between">
        {title && (
          <Grid item xs>
            <Typography
              color="primary"
              className={classes.title}
              component="h1"
              variant="h5"
            >
              {he.decode(title)}
            </Typography>
          </Grid>
        )}
        <Grid container item xs direction="row" justifyContent="flex-end">
          {actions?.map((action: Record<string, string>, key: number) => (
            <Button
              key={key}
              className={classes.button}
              component={RouterLink}
              variant="contained"
              color="primary"
              to={action.link}
            >
              {action.label}
            </Button>
          ))}
        </Grid>
      </Grid>
      <Grid container item xs={12} direction="row">
        {children}
      </Grid>
    </Container>
  );
};

Page.defaultProps = {
  title: undefined,
  children: undefined,
  actions: undefined,
};

export default Page;
