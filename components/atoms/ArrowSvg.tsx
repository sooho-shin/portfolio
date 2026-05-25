import React from "react";

type Props = {
  className?: string;
  direction?: "left" | "right";
};

const ArrowSvg = ({ className, direction = "right" }: Props) => {
  if (direction === "left") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="239.398"
        height="164.987"
        viewBox="0 0 239.398 164.987"
        className={className}
      >
        <g transform="translate(-149.102 -434.108)">
          <path
            d="M136.911,499.6s49.913-15.781,49.913-46.255V417.108"
            transform="translate(14 17)"
            fill="none"
            stroke="#000"
            strokeWidth="12"
          />
          <path
            d="M136.911,417.108s49.913,15.781,49.913,46.255V499.6"
            transform="translate(14 99.493)"
            fill="none"
            stroke="#000"
            strokeWidth="12"
          />
          <line
            x2="238"
            transform="translate(150.5 516.5)"
            fill="none"
            stroke="#000"
            strokeWidth="12"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="239.398"
      height="164.987"
      viewBox="0 0 239.398 164.987"
      className={className}
    >
      <path
        d="M186.824,499.6s-49.913-15.781-49.913-46.255V417.108"
        transform="translate(50.765 -417.108)"
        fill="none"
        stroke="#000"
        strokeWidth="12"
      />
      <path
        d="M186.824,417.108s-49.913,15.781-49.913,46.255V499.6"
        transform="translate(50.765 -334.615)"
        fill="none"
        stroke="#000"
        strokeWidth="12"
      />
      <line
        x1="238"
        transform="translate(0 82.392)"
        fill="none"
        stroke="#000"
        strokeWidth="12"
      />
    </svg>
  );
};

export default ArrowSvg;
