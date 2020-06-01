jest.mock('@popperjs/core', () => ({
  createPopper: () => ({
    destroy: () => {},
    update: () => {},
  }),
}));
