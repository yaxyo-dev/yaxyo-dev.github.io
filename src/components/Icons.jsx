// The site's few icons, all drawn to one stroke weight so they match.
function Icon({ children, ...props }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = () => <Icon><path d="M4 12h15M13 6l6 6-6 6" /></Icon>;
export const ArrowLeft = () => <Icon><path d="M20 12H5M11 6l-6 6 6 6" /></Icon>;
export const ArrowUpRight = () => <Icon><path d="M6 18 18 6M9 6h9v9" /></Icon>;
export const ArrowDown = () => <Icon><path d="M12 4v15M6 13l6 6 6-6" /></Icon>;
export const Menu = () => <Icon><path d="M3 8h18M3 16h18" /></Icon>;
export const Close = () => <Icon><path d="M5 5l14 14M19 5 5 19" /></Icon>;
export const Play = () => <Icon fill="currentColor" stroke="none"><path d="M7 4l14 8-14 8z" /></Icon>;

export const Sun = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const Moon = (props) => (
  <Icon {...props}>
    <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
  </Icon>
);
