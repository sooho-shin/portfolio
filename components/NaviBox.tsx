"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import { breakpoints } from "@/config/breakboint";
import { Playfair_Display } from "next/font/google";
import classNames from "classnames";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const NaviComponent = () => {
  const [naviState, setNaviState] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setNaviState(false);
  }, [pathname]);

  return (
    <NaviWrapper $navistate={naviState}>
      <div className="tablet mobile-navi">
        <p className="title">Sooho</p>
        <button
          className="hamburger-group"
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={naviState}
          aria-controls="site-navigation"
          onClick={() => {
            setNaviState(true);
          }}
        >
          <div></div>
          <div></div>
        </button>
      </div>
      <nav className="navi-group" id="site-navigation" aria-label="Primary">
        <div className="content">
          <button
            className="dim"
            type={"button"}
            aria-label="메뉴 닫기"
            onClick={() => {
              setNaviState(false);
            }}
          ></button>
          <Link
            href="/"
            className={classNames("navi", "home", playfair.className)}
          >
            HOME
          </Link>
          <Link href="/work" className="navi">
            WORK
          </Link>
          <Link href="/about" className="navi">
            ABOUT
          </Link>
        </div>
      </nav>
    </NaviWrapper>
  );
};

const NaviWrapper = styled.div<{ $navistate: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 150;

  @media (max-width: ${breakpoints.md}px) {
    position: inherit;
    margin-left: 40px;
    width: calc(100% - 40px);
    height: calc(12vw + 24px);
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
  }

  .navi-group {
    border-radius: 2.8vw;
    background-color: #fff;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
    z-index: 150;
    position: relative;
    .content {
      width: 100%;
      height: 100%;
      padding: 0 1vw;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      > .dim {
        display: none;
        background-color: #000;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        cursor: default;
      }
      .navi {
        padding: 0.5vw;
        margin: 0.5vw;
        font-size: 0.92em;
        color: black;
        cursor: pointer;
        display: block;
        z-index: 15;
        @media (max-width: ${breakpoints.md}px) {
          color: white;
        }
        &.home {
          font-weight: 700;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
    @media (max-width: ${breakpoints.md}px) {
      position: fixed;
      width: 100%;
      height: 100%;
      padding: 0;
      border-radius: 0px;
      // background-color: #000;
      top: 0;
      z-index: 200;
      transition: all 100ms;
      ${props =>
        props.$navistate
          ? css`
              left: 0;
            `
          : css`
              left: -100%;
            `}
      .content {
        padding-left: 48px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        > .dim {
          display: block;
        }
        .navi {
          font-size: 16vw;
          line-height: 0.85em;
          text-transform: uppercase;
        }
      }
    }
  }
`;

export default NaviComponent;
