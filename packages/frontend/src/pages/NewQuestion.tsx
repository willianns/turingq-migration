import React from 'react';

import NewQuestionForm from '../components/NewQuestionForm';

import Page from '../components/Page';

const actions = [
  {
    label: 'All questions',
    link: '/',
  },
];

const NewQuestion: React.FC = () => (
  <Page title="Ask a new question" actions={actions}>
    <NewQuestionForm />
  </Page>
);

export default NewQuestion;
