"use client";

import React, { useEffect, useState, useRef } from "react";
import { useWindowSize } from "react-use";
import styled, { css, keyframes } from "styled-components";
import { breakpoints } from "@/config/breakboint";

type Props = {
  text: string;
  rollingText?: string;
};

const EffectComponent = ({ text, rollingText = "text text" }: Props) => {
  const [pageState, setPageState] = useState<string | null>(text);
  const [rollingTextState, setRollingTextState] = useState(rollingText);
  const effectRef = useRef<any>();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    effectRef.current.style.width = `40px`;
    if (windowWidth > breakpoints.md) {
      effectRef.current.style.left = `calc(25vw - 40px)`;
    } else {
      effectRef.current.style.left = `0`;
    }
    setTimeout(() => {
      if (effectRef.current) {
        effectRef.current.style.transition = "none";
      }
    }, 3000);
  }, [windowWidth]);

  return (
    <EffectBox $pageState={pageState} ref={effectRef}>
      {pageState ? (
        <>
          <div className="mask">
            <span>{pageState}</span>
          </div>
          <div className="loop-row-mask">
            <div className="show-ani">
              <div className="loop-row">
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
              </div>
            </div>
          </div>
          <div className="loop-row-mask">
            <div className="show-ani">
              <div className="loop-row reverse">
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
              </div>
            </div>
          </div>
          <div className="loop-row-mask">
            <div className="show-ani">
              <div className="loop-row">
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
                <span>{rollingTextState}</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </EffectBox>
  );
};

const toggleAni = keyframes`
  0%{
    width:100%;
  }
  100%{
    /* left:calc(25vw - 40px); */
    transform:translateX(calc(25vw - 40px));
    width:40px;
  }
`;

const titleAni = keyframes`
  0%{
    transform:translateY(-100%);
  }
  10%{
    transform:translateY(0%);
  }
  90%{
    transform:translateY(0%);
  }
  100%{
    transform:translateY(-100%);
  }
  
`;

const showAni = keyframes`
  0%{
    transform:translateY(100%);
  }
  100%{
    transform:translateY(0%);
  }
  
`;

const rowAni = keyframes`
  0%{
    transform:translateX(0%);
  }
  100%{
    transform:translateX(50%);
  }
`;

const rowAniReverse = keyframes`
  0%{
    transform:translateX(0%);
  }
  100%{
    transform:translateX(-50%);
  }
`;

const EffectBox = styled.div<{ $pageState: string | null }>`
  position: fixed;
  left: 0;
  width: 100%;
  top: 0;
  height: 100%;
  background-color: #fff;
  border-left: 4px solid #000;
  border-right: 4px solid #000;
  overflow: hidden;
  transition: all 300ms;
  transition-delay: 2000ms;
  /* transform:translateX(0) !important; */
  // 3
  /* left:0 !important; */
  /* animation: ${toggleAni} linear 300ms alternate forwards 2000ms; */

  @media (max-width: ${breakpoints.md}px) {
    left: 0;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 8000;

  > .mask {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;

    span {
      display: block;
      font-size: 15vw;
      color: #000;
      transform: translateY(-100%);
      text-transform: uppercase;
      // 2
      animation: ${titleAni} linear 1000ms alternate forwards 250ms;
    }
  }
  > .loop-row-mask {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .show-ani {
      transform: translateY(-100%);
      // 3
      animation: ${showAni} linear 100ms alternate forwards 1250ms;
      .loop-row {
        animation: ${rowAni} 30s linear alternate infinite;
        &.reverse {
          animation: ${rowAniReverse} 30s linear alternate infinite;
        }
        span {
          text-transform: uppercase;
          white-space: nowrap;
          margin-right: 1.5vw;
          font-size: 70px;
        }
      }
    }
  }
`;

export default EffectComponent;
