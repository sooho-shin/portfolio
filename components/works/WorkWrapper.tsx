"use client";

import React, { useEffect, useRef, useState } from "react";
import LeftWrapperComponent from "@/components/LeftWrapper";
import RightWrapperComponent from "@/components/RightWrapper";
import { Textfit } from "react-textfit";
import { useWindowScroll, useWindowSize } from "react-use";
import FooterComponent from "@/components/Footer";
import EffectComponent from "@/components/EffectBox";
import styled from "styled-components";
import { breakpoints } from "@/config/breakboint";
import GalleryBox from "@/components/GalleryBox";

type memberType = {
  user_idx: number;
  name: string;
  job: string;
};

const clientArrayData: string[] = [
  "Netflix",
  "Apple",
  "Samsung",
  "Nike",
  "Google",
  "MicroSoft",
  "Gucci",
  "Adidas",
  "Hyundae",
  "Chanel",
  "Kia",
  "Tesla",
];

const WorkWrapper = () => {
  const [effectTitle, setEffectTitle] = useState("work");
  const [effectRollingText, setEffectRollingText] = useState("SOOHO about");

  const memberArrayData: memberType[] = [
    {
      user_idx: 1,
      name: "sooho",
      job: "web front developer",
    },
    {
      user_idx: 2,
      name: "gildong",
      job: "web server developer",
    },
    {
      user_idx: 3,
      name: "sunsin",
      job: "designer",
    },
    {
      user_idx: 4,
      name: "LeeJaeYong",
      job: "ceo",
    },
  ];

  const [currentMemberIdx, setCurrentMemberIdx] = useState<number>(1);
  const [clientArray] = useState(clientArrayData);
  // const sliderRef = useRef<any>();
  const sliderJobRef = useRef<any>();
  const sliderImgRef = useRef<any>();
  const mainContainer = useRef<any>();
  const infoText = useRef<any>();
  const { x: scrollX, y: scrollY } = useWindowScroll();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    if (infoText) {
      const mainHeight = mainContainer.current.offsetHeight;
      if (windowHeight + scrollY > mainHeight) {
        // setInfoTextMaigin(windowHeight + scrollY - mainHeight)
        infoText.current.style.transform = `translate3d(0px,-${
          windowHeight + scrollY - mainHeight
        }px,0px)`;
      } else {
        // setInfoTextMaigin(0)
        infoText.current.style.transform = `translate3d(0px,0px,0px)`;
      }
    }
  }, [scrollY, windowHeight, windowWidth]);

  return (
    <MainWrapper>
      <Section ref={mainContainer}>
        <LeftWrapperComponent>
          <AboutLeft>
            <div className="about-info" ref={infoText}>
              <p className="title">Inquiries:</p>
              <p className="mail">soojoon92@gmail.com</p>
              <p className="info">
                CONTACT:
                <br />
                Blumenkopf kein Studio
                <br />
                Burgring 123
                <br />
                1010 Wien, Korea
              </p>
            </div>
          </AboutLeft>
        </LeftWrapperComponent>
        <RightWrapperComponent>
          <GalleryContainer>
            <GalleryBox
              text={"catch catch"}
              imgFirst={}
              imgSecond={}
              imgThird={}
            />
          </GalleryContainer>
        </RightWrapperComponent>
      </Section>
      <FooterComponent />
      <EffectComponent text={effectTitle} rollingText={effectRollingText} />
    </MainWrapper>
  );
};

const GalleryContainer = styled.div`
  width: 100%;
  margin-top: calc(84px);
`;

const AboutLeft = styled.div`
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

    > p {
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

const Section = styled.div`
  width: 100%;
  border-bottom: 4px solid #000;
  display: flex;
  height: fit-content;

  &.no-border {
    border: none;
  }

  &.home-about {
    padding-bottom: 120px;
  }

  &.fd-c {
    flex-direction: column;
  }

  .text-right {
    text-align: right;

    a {
      margin-top: 2vw;
    }
  }
`;

const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  /* justify-content: center; */
`;

export default WorkWrapper;
