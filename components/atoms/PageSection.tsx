"use client";

import styled from "styled-components";
import { breakpoints } from "@/config/breakboint";

const PageSection = styled.section`
  width: 100%;
  border-bottom: 4px solid #000;
  display: flex;
  height: fit-content;

  &.no-border {
    border: none;
  }

  &.home-about {
    padding-bottom: 120px;
    @media (max-width: ${breakpoints.md}px) {
      padding-bottom: 30px;
    }
  }

  &.fd-c {
    flex-direction: column;
  }

  &.center-text {
    @media (max-width: ${breakpoints.md}px) {
      padding-left: 40px;
      box-sizing: border-box;
    }
  }

  .text-right {
    text-align: right;

    a {
      margin-top: 2vw;
    }
  }
`;

export default PageSection;
