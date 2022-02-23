import Alert from './index';

export default { title: 'junipero/Alert' };

export const expanded = () => (
  <>
    <p>
      <Alert
        title="Title"
        className="success"
        icon={<i className="material-icons">check_box</i>}
      >
        Lorem Ipsum is simply dummy text of the printing
      </Alert>
    </p>
    <p>
      <Alert
        title="Title"
        icon={<i className="material-icons">warning</i>}
        className="warning"
      >
        Lorem Ipsum is simply dummy text of the printing
      </Alert>
    </p>
    <p>
      <Alert
        title="Title"
        icon={<i className="material-icons">error</i>}
        className="danger"
      >
        Lorem Ipsum is simply dummy text of the printing
      </Alert>
    </p>
  </>
);

export const compact = () => (
  <>
    <p>
      <Alert
        title="Title"
        className="success compact"
        icon={<i className="material-icons">check_box</i>}
      >
        Lorem Ipsum is simply dummy text of the printing
      </Alert>
    </p>
    <p>
      <Alert
        title="Title"
        icon={<i className="material-icons">warning</i>}
        className="warning compact"
      >
        Lorem Ipsum is simply dummy text of the printing
      </Alert>
    </p>
    <p>
      <Alert
        title="Title"
        icon={<i className="material-icons">error</i>}
        className="danger compact"
      >
        Lorem Ipsum is simply dummy text of the printing
      </Alert>
    </p>
  </>
);
