"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";
import FooterComponent from "@/components/Footer";
import EffectComponent from "@/components/EffectBox";

type Props = {
  children: ReactNode;
  effectTitle: string;
  effectRollingText: string;
};

const PortfolioPageShell = ({
  children,
  effectTitle,
  effectRollingText,
}: Props) => (
  <Wrapper>
    {children}
    <FooterComponent />
    <EffectComponent text={effectTitle} rollingText={effectRollingText} />
  </Wrapper>
);

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
  display: block;
`;

export default PortfolioPageShell;
