import React from 'react';

const Toolbox = ({
  toggleDisabled,
  toggleError,
  togglePlaceholder,
  toggleBoxed,
}) => (
  <div
    style={{
      padding: 20,
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: '#FFF',
      border: '1px solid #000',
    }}
  >
    <button
      className="btn btn-primary btn-sm btn-block"
      onClick={toggleError}
    >Toggle error</button>
    <button
      className="btn btn-primary btn-sm btn-block"
      onClick={toggleDisabled}
    >Toggle disabled</button>
    <button
      className="btn btn-primary btn-sm btn-block"
      onClick={togglePlaceholder}
    >Toggle placeholder</button>
    <button
      className="btn btn-primary btn-sm btn-block"
      onClick={toggleBoxed}
    >Toggle boxed</button>
  </div>
);

export default Toolbox;
