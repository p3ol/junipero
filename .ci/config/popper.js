jest.mock('react-popper', () => ({
  usePopper: () => ({
    styles: {},
    attributes: {},
    update: () => {},
    forceUpdate: () => {}
  }),
}));
