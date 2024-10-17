import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

type Props = {
  text: string;
  imgFirst: any;
  imgSecond: any;
  imgThird: any;
};

const GalleryComponent = ({
  text = "text text",
  imgFirst,
  imgSecond,
  imgThird,
}: Props) => {
  return (
    <ProjectWrapper
      imgFirst={imgFirst}
      imgSecond={imgSecond}
      imgThird={imgThird}
    >
      <div className="content">
        <p className="title">{text}</p>
        <div className="project-box">
          <div className="project first"></div>
          <div className="project second"></div>
          <div className="project third"></div>
        </div>
        <div className="text-loop-container top">
          <div className="loop-box">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
          <div className="loop-box">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
        </div>
        <div className="text-loop-container right">
          <div className="loop-box">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
          <div className="loop-box">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
        </div>

        <div className="text-loop-container left">
          <div className="loop-box">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
          <div className="loop-box">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
        </div>
        <div className="text-loop-container bottom">
          <div className="loop-box">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
          <div className="loop-box">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
        </div>
      </div>
    </ProjectWrapper>
  );
};

const textLoopAni = keyframes`
  0%{
    transform:translateX(-100%);
  }
  100%{
    transform:translateX(0%);
  }
`;

const textLoopAniVertical = keyframes`
  0%{
    transform:translateY(-100%);
  }
  100%{
    transform:translateY(0%);
  }
`;

const ProjectWrapper = styled.div<{
  imgFirst: any;
  imgSecond: any;
  imgThird: any;
}>`
  background-color: #fff;
  display: inline-block;
  z-index: 100;
  width: 100%;
  height: 100%;
  left: -4px;
  cursor: pointer;
  box-sizing: border-box;
  &:hover {
    .loop-box {
      display: inline-flex !important;
    }
    .content {
      .project {
        &.first {
          transform: translate(-50%, -50%) rotate(-4deg);
          opacity: 1;
        }
        &.second {
          transform: translate(-50%, -50%) rotate(2deg);
          opacity: 1;
          transition-delay: 100ms;
        }
        &.third {
          transform: translate(-50%, -50%) rotate(-8deg);
          opacity: 1;
          transition-delay: 200ms;
        }
      }
    }
  }

  .content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 8vw;

    > p.title {
      position: absolute;
      bottom: 10px;
      left: 10px;
      text-transform: uppercase;
      font-size: 1rem;
      font-weight: 500;
    }

    .project-box {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .project {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;

      &.first {
        ${props => css`
          background-image: url(${props.imgFirst});
        `}
        background-size:cover;
        background-position: center;
        background-repeat: no-repeat;
        transform: translate(-50%, -50%);
      }
      &.second {
        ${props => css`
          background-image: url(${props.imgSecond});
        `}
        background-size:cover;
        background-position: center;
        background-repeat: no-repeat;
        transform: translate(-50%, -50%) rotate(6deg);
        opacity: 0;
        transition-delay: 50ms;
      }
      &.third {
        ${props => css`
          background-image: url(${props.imgThird});
        `}
        background-size:cover;
        background-position: center;
        background-repeat: no-repeat;
        transform: translate(-50%, -50%) rotate(-2deg);
        opacity: 0;
        transition-delay: 100ms;
      }
    }

    .text-loop-container {
      width: 100%;
      /* height:2vw; */
      position: absolute;
      background-color: #000;
      overflow: hidden;
      display: inline-flex;
      flex-wrap: nowrap;

      &.top {
        top: 0;
        left: 0;
      }
      &.bottom {
        bottom: 0;
        left: 0;
        .loop-box {
          animation: ${textLoopAni} linear 10s reverse infinite;
        }
      }
      &.right {
        height: 100%;
        top: 0;
        right: 0;
        width: auto;
        flex-direction: column;
        .loop-box {
          animation: ${textLoopAniVertical} linear 10s normal infinite;
          flex-direction: column;
          > span {
            writing-mode: vertical-lr;
          }
        }
      }
      &.left {
        height: 100%;
        top: 0;
        left: 0;
        width: auto;
        flex-direction: column;
        .loop-box {
          animation: ${textLoopAniVertical} linear 10s reverse infinite;
          flex-direction: column;
          > span {
            writing-mode: vertical-lr;
          }
        }
      }

      .loop-box {
        color: #fff;
        /* display: inline-flex; */
        display: none;
        animation: ${textLoopAni} linear 10s normal infinite;

        > span {
          font-size: 1.5vw;
          margin: 0.5vw 0.3vw;
          text-transform: uppercase;
          white-space: nowrap;

          &:nth-child(2n) {
            opacity: 0.7;
          }
        }
      }
    }
  }
`;

export default GalleryComponent;
