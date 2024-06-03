import { generate } from '../tests/utils';
import plugin from './index';

describe('@junipero/tailwind-plugin', () => {
  it('should generate the correct CSS', async () => {
    const css = await generate(plugin, `
      <div class="bg-velvet"></div>
    `);

    expect(css).toMatchSnapshot();
  });
});
