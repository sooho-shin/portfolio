import React from "react";

type Props = {
  className?: string;
  id?: string;
};

const BlackholeSvg = ({ className, id }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 1440 1440.003"
    className={className}
    preserveAspectRatio="none meet"
  >
    <path
      id={id}
      d="M653,480l-720,0V-238.46C-66.172,157.7,256.818,480,653,480h0Zm720,0H653c396.025,0,719.015-322.189,720-718.216ZM-67-241.542h0V-960H651.46C256.125-959.174-66.174-636.876-67-241.542Zm1440-.241h0c-.981-395.2-323.279-717.392-718.456-718.216H1373Z"
      transform="translate(67 960.001)"
      data-v-3a229bb7=""
    ></path>
  </svg>
);

export default BlackholeSvg;
