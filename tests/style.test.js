import { inject } from '../src/style';
import mainStyles from '../src/theme/index.styl';

describe('inject(styles, id)', () => {
  it('should inject main styles inside of page with custom ones', () => {
    const customStyles = 'body{ background: #F00; }';
    inject(customStyles, 'junipero-test-styles');

    expect(document.getElementById('junipero-main-styles').textContent)
      .toBe(mainStyles);
    expect(document.getElementById('junipero-test-styles').textContent)
      .toBe(customStyles);
  });
});
