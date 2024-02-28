import { ensureNode } from '.';

describe('dom', () => {
  describe('ensureNode(container)', () => {
    it('should return the same element if passed as argument', () => {
      const elmt = document.createElement('a');
      expect(ensureNode(elmt)).toBe(elmt);
    });

    it('should return a new element if container is a string and is not found' +
      'in DOM', () => {
      expect(ensureNode('stuff')).toBeDefined();
    });

    it('should return an existing element if container is a string and it is ' +
      'found in DOM', () => {
      const body = document.body;
      expect(ensureNode('body')).toBe(body);
    });
  });
});
