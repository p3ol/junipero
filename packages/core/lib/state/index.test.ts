import { mockState } from './';

describe('state', () => {
  describe('mockState(state, action)', () => {
    it('should merge state with action object to simulate setState', () => {
      expect(mockState({ foo: 'bar' }, { foo: 'test' }))
        .toMatchObject({ foo: 'test' });
    });

    it('should allow to use a function to compute new state', () => {
      expect(mockState({ foo: 'bar' }, state => ({ foo: state.foo + 'test' })))
        .toMatchObject({ foo: 'bartest' });
    });
  });
});
