import React from 'react';

import Tag from './index';

export default { title: 'junipero/Tag' };

export const basic = () => (
  <>
    <p><Tag value="New"/></p>
    <p><Tag className="primary" value="New"/></p>
    <p><Tag className="secondary" value="New"/></p>
    <p><Tag className="ternary" value="New"/></p>
    <p><Tag className="warning" value="New"/></p>
    <p><Tag className="danger" value="New"/></p>
    <p><Tag className="success" value="New"/></p>
  </>
);
