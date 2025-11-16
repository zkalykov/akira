export function AkiraLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        width="260"
        height="80"
        viewBox="0 0 260 80"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g transform="skewX(-10)">
          <text
            x="20"
            y="55"
            fill="#000000"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fontWeight="700"
            fontStyle="italic"
            fontSize="42"
            letterSpacing="6"
          >
            AKIRA
          </text>
        </g>
      </svg>
    );
  }
  