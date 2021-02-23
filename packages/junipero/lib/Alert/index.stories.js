import React from 'react';

import Alert from './index';

export default { title: 'junipero/Alert' };

export const full = () => (
  <>
    <p>
      <Alert
        title="Title"
        className="full material-icons success"
        full
        icon="check_box"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
    <p>
      <Alert
        title="Title"
        icon="warning"
        className="full material-icons warning"
        full
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
    <p>
      <Alert
        title="Title"
        icon="error"
        className="full material-icons danger"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
  </>
);

export const empty = () => (
  <>
    <p>
      <Alert
        title="Title"
        className="material-icons success"
        icon="check_box"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
    <p>
      <Alert
        title="Title"
        icon="warning"
        className="material-icons warning"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
    <p>
      <Alert
        title="Title"
        icon="error"
        className="material-icons danger"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
  </>
);
