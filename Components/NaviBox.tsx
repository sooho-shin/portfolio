import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useWindowSize } from "react-use";
import styled, { css, keyframes } from "styled-components";
import { breakpoints } from "@/config/breakboint";

type Props = {
  text: string;
  rollingText?: string;
};

// const EffectComponent = ({text,rollingText = 'text text'}:Props) => {
const NaviComponent = () => {
  const [naviState, setNaviState] = useState<boolean>(false);
  const router = useRouter();
  // useEffect(()=>{
  //   console.log(router.pathname);
  // })
  const pushRouter = (url: string) => {
    if (router.pathname === url) {
      setNaviState(false);
    }
    router.push(url);
  };
  return (
    <NaviWrapper naviState={naviState}>
      <div className="tablet mobile-navi">
        <p className="title">Sooho</p>
        <button
          className="hamburger-group"
          onClick={() => {
            setNaviState(true);
          }}
        >
          <div></div>
          <div></div>
        </button>
      </div>
      <div className="navi-group">
        <button
          className="navi home sec-font"
          type="button"
          onClick={() => pushRouter("/")}
        >
          HOME
        </button>
        <button
          className="navi"
          type="button"
          onClick={() => pushRouter("/work")}
        >
          WORK
        </button>
        <button
          className="navi"
          type="button"
          onClick={() => pushRouter("/about")}
        >
          ABOUT
        </button>
      </div>
    </NaviWrapper>
  );
};

const NaviWrapper = styled.div<{ naviState: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;

  @media (max-width: ${breakpoints.md}px) {
    position: inherit;
    margin-left: 40px;
    width: calc(100% - 40px);
    height: calc(12vw + 24px);
  }

  .mobile-navi {
    position: fixed;
    width: calc(100% - 64px);
    top: 12px;
    right: 12px;
    height: 12vw;
    border-radius: 8vw;
    z-index: 190;
    background-color: #fff;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4vw;
    padding-right: 0;

    .hamburger-group {
      padding: 4vw;
      > div {
        width: 34px;
        height: 6px;
        background-color: #000;
      }
      div + div {
        margin-top: 4px;
      }
    }
  }

  .navi-group {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1vw;
    border-radius: 2.8vw;
    background-color: #fff;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
    @media (max-width: ${breakpoints.md}px) {
      position: fixed;
      width: 100%;
      height: 100%;
      padding: 0 1vw;
      border-radius: 0px;
      background-color: #000;
      top: 0;
      z-index: 200;
      transition: all 100ms;
      ${props =>
        props.naviState
          ? css`
              left: 0;
            `
          : css`
              left: -100%;
            `}
    }
    .navi {
      padding: 0.5vw;
      margin: 0.5vw;
      font-size: 0.92em;
      color: black;
      cursor: pointer;
      @media (max-width: ${breakpoints.md}px) {
        color: white;
      }

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export default NaviComponent;
