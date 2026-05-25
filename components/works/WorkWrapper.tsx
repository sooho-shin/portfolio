"use client";

import React, { useEffect, useRef } from "react";
import LeftWrapperComponent from "@/components/LeftWrapper";
import RightWrapperComponent from "@/components/RightWrapper";
import { Textfit } from "react-textfit";
import { useWindowScroll, useWindowSize } from "react-use";
import FooterComponent from "@/components/Footer";
import EffectComponent from "@/components/EffectBox";
import styled from "styled-components";
import { breakpoints } from "@/config/breakboint";
import GalleryBox from "@/components/GalleryBox";
import Link from "next/link";
import ContactInfoPanel from "@/components/ContactInfoPanel";

const WorkWrapper = () => {
  const effectTitle = "work";
  const effectRollingText = "SOOHO work";

  const mainContainer = useRef<HTMLDivElement | null>(null);
  const infoText = useRef<HTMLDivElement | null>(null);
  const { y: scrollY } = useWindowScroll();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    if (infoText.current && mainContainer.current) {
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

  // {/*  text={"catch catch"}*/}
  // {/*  imgFirst={}*/}
  // {/*  imgSecond={}*/}
  // {/*  imgThird={}*/}
  const workArray = [
    {
      id: "yummygame",
      text: "yummygame",
      images: ["/yummygame/1.png", "/yummygame/2.png", "/yummygame/3.png"],
    },
    {
      id: "yummy-game-2",
      text: "yummy yummy",
      images: ["/yummygame/1.png", "/yummygame/2.png", "/yummygame/3.png"],
    },
    {
      id: "yummy-game-3",
      text: "yummy yummy",
      images: ["/yummygame/1.png", "/yummygame/2.png", "/yummygame/3.png"],
    },
    {
      id: "yummy-game-4",
      text: "yummy yummy",
      images: ["/yummygame/1.png", "/yummygame/2.png", "/yummygame/3.png"],
    },
  ];

  return (
    <MainWrapper>
      <Section ref={mainContainer}>
        <LeftWrapperComponent>
          <ContactInfoPanel infoRef={infoText} />
        </LeftWrapperComponent>
        <RightWrapperComponent>
          <GalleryContainer>
            {workArray.map(c => {
              return (
                <Link href={"/"} key={c.id}>
                  <GalleryBox
                    text={c.text}
                    imgFirst={"/images/work" + c.images[0]}
                    imgSecond={"/images/work" + c.images[1]}
                    imgThird={"/images/work" + c.images[2]}
                  />
                </Link>
              );
            })}
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
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  border-top: 4px solid #000;
  @media (max-width: ${breakpoints.sm}px) {
    margin-top: 0;
  }
  > a {
    width: 50%;
    border-bottom: 4px solid #000;
    font-size: 0;
    aspect-ratio: 1/ 1;
    @media (max-width: ${breakpoints.sm}px) {
      width: 100%;
    }
    &:nth-child(odd) {
      border-right: 4px solid #000;
      @media (max-width: ${breakpoints.sm}px) {
        border-right: none;
      }
    }

    &:nth-last-child(2),
    &:last-child {
      border-bottom: none;
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
