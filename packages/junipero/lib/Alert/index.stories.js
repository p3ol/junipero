import React from 'react';

import Alert from './index';

export default { title: 'junipero/Alert' };

export const full = () => (
  <>
    <p>
      <Alert
        title="Title"
        className="full material-icons"
        icon="check_box"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
    <p>
      <Alert
        theme="warning"
        title="Title"
        icon="warning"
        className="full material-icons"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
    <p>
      <Alert
        theme="danger"
        title="Title"
        icon="error"
        className="full material-icons"
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
        className="material-icons"
        icon="check_box"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
    <p>
      <Alert
        theme="warning"
        title="Title"
        icon="warning"
        className="material-icons"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
    <p>
      <Alert
        theme="danger"
        title="Title"
        icon="error"
        className="material-icons"
        text="Lorem Ipsum is simply dummy text of the printing "
      />
    </p>
  </>
);
