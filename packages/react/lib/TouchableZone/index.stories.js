import TouchableZone from './index';

export default { title: 'react/TouchableZone' };

export const basic = () => (
  <TouchableZone>
    <i className="material-icons" style={{ marginRight: 10 }}>add</i>
    <span>Add image</span>
  </TouchableZone>
);
