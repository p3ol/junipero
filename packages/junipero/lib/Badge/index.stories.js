import React from 'react';

import Badge from './index';

export default { title: 'junipero/Badge' };

export const basic = () => (
  <>
    <p><Badge value="1" /></p>
    <p><Badge className="primary" value="1" /></p>
    <p><Badge className="secondary" value="1" /></p>
    <p><Badge className="ternary" value="1" /></p>
    <p><Badge className="warning" value="1" /></p>
    <p><Badge className="danger" value="1" /></p>
    <p><Badge className="success" value="1" /></p>
  </>
);
