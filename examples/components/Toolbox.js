import React, { useContext } from 'react';

import { AppContext } from '../services/contexts';

export default () => {
  const {
    update,
    error = false,
    disabled = false,
    placeholder = false,
    boxed = false,
  } = useContext(AppContext);

  return (
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
        onClick={() => update({ error: !error })}
      >Toggle error</button>
      <button
        className="btn btn-primary btn-sm btn-block"
        onClick={() => update({ disabled: !disabled })}
      >Toggle disabled</button>
      <button
        className="btn btn-primary btn-sm btn-block"
        onClick={() => update({ placeholder: !placeholder })}
      >Toggle placeholder</button>
      <button
        className="btn btn-primary btn-sm btn-block"
        onClick={() => update({ boxed: !boxed })}
      >Toggle boxed</button>
    </div>
  );
};
