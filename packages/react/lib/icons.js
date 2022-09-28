export const Arrows = props => (
  <svg
    { ...props }
    className="junipero icon arrows"
    width="8"
    height="13"
    viewBox="0 0 8 13"
  >
    <path d="M1 4.5L4 1.5L7 4.5" />
    <path d="M1 8.5L4 11.5L7 8.5" />
  </svg>
);

export const Remove = props => (
  <svg
    { ...props }
    className="junipero icon remove"
    width="10"
    height="10"
    viewBox="0 0 9 10"
  >
    <path d="M8 1.5L1 8.5" />
    <path d="M1 1.5L8 8.5" />
  </svg>
);
