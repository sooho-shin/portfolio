"use client";

import React from "react";
import styled from "styled-components";
import { siteProfile } from "@/config/profile";

type Props = {
  infoRef?: React.Ref<HTMLDivElement>;
};

const ContactInfoPanel = ({ infoRef }: Props) => {
  return (
    <Wrapper>
      <div className="about-info" ref={infoRef}>
        <p className="title">Inquiries:</p>
        <a className="mail" href={`mailto:${siteProfile.email}`}>
          {siteProfile.email}
        </a>
        <p className="info">
          CONTACT:
          <br />
          Service Development
          <br />
          AI Workflow Review
          <br />
          Seoul, Korea
        </p>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 25vw;
  padding-right: 40px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;

  .about-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 50px 10px 10px;
    box-sizing: border-box;

    > p,
    > a {
      &.title {
        font-size: 1.875vw;
      }

      &.mail {
        font-size: 3vw;
        text-decoration: underline;
        text-transform: uppercase;
        margin-bottom: 4px;
        word-break: break-all;
      }
    }
  }
`;

export default ContactInfoPanel;
