import React from 'react';
import Tag from './index';

export default { title: 'junipero-native/Tag' };

export const basic = () => (
  <>
    <p><Tag>New</Tag></p>
    <p><Tag theme="primary">New</Tag></p>
    <p><Tag theme="secondary">New</Tag></p>
    <p><Tag theme="ternary">New</Tag></p>
    <p><Tag theme="warning">New</Tag></p>
    <p><Tag theme="danger">New</Tag></p>
    <p><Tag theme="success">New</Tag></p>
  </>
);
