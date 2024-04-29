"use client";

import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { breakpoints } from "@/config/breakboint";

type Props = {
  children?: ReactNode;
};

const LeftWrapperComponent = ({ children }: Props) => (
  <LeftWrapper>{children}</LeftWrapper>
);

const LeftWrapper = styled.div`
  width: calc(25vw);
  padding-right: 40px;
  ${props => css`
    @media (max-width: ${breakpoints.md}px) {
      transform: translateX(0) !important;
      display: none;
    }
  `}

  /* border-right:2px solid #000; */
  box-sizing:border-box;
`;

export default LeftWrapperComponent;
