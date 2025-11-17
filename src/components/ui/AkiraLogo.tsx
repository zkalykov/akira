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
          // fill="#000000"
          fill="#0F0F0F"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontWeight="800"
          fontStyle="normal"
          fontSize="42"
          letterSpacing="1"
        >
          AkA
        </text>
      </g>
    </svg>
  );
}
