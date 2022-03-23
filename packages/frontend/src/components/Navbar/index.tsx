import React from 'react';
import { AppBar, Link, makeStyles, Toolbar } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import Menu from './Menu';

const useStyles = makeStyles(() => ({
  toolbar: {
    background: 'linear-gradient(120deg, #7f70f5, #0ea0ff)',
    '& a': {
      fontWeight: 700,
    },
  },
  title: {
    flexGrow: 1,
    fontSize: '1.5rem',
    textAlign: 'left',
  },
}));

const Navbar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <Link
          className={classes.title}
          component={RouterLink}
          to="/"
          color="inherit"
          underline="none"
        >
          TuringQ
        </Link>
        <Menu />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
