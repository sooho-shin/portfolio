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

const AboutWrapper = () => {
  const [effectTitle, setEffectTitle] = useState("about");
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
  const sliderRef = useRef<any>();
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

  useEffect(() => {
    if (sliderRef) {
      sliderRef.current.style.transform = `translateX(-${
        currentMemberIdx - 1
      }00%)`;
      sliderJobRef.current.style.transform = `translateX(-${
        currentMemberIdx - 1
      }00%)`;
      sliderImgRef.current.style.transform = `translateX(-${
        currentMemberIdx - 1
      }00%)`;
    }
  }, [currentMemberIdx]);

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
          <Title>
            <Textfit
              // style={{ width: "100%", height: "auto" }}
              max={9999}
              mode="single"
              // forceSingleModeWidth={true}
            >
              INFO
            </Textfit>
          </Title>
          <CenterInfo>
            <div>
              <p>
                WE ARE NO AUSTRIAN AESTETHICS STUDIO WITH A FOCUS ON EDITORIAL
                AND CONTEMPORARY ART.
              </p>
              <div className="flex">
                <p>
                  {`But maybe you are! If that's the case go and buy this
                                        website. Your company will immediately look awesome. All of
                                        your competitors will be mad because they bought Wordpress
                                        templates and can't buy this limited beauty anymore. That's
                                        the magic of 'Limited by Spatzek'.`}
                </p>
                <p>
                  {`Your are not sure? Well, a site like this usually costs
                  between 20-30k EUR. But now you can actually buy it for 6k!
                  And you won't even have to wait for 3 months - it can be
                  online within a few days! Plus you know exactly what you'll
                  get. Let's go!`}
                </p>
              </div>
            </div>
          </CenterInfo>
          <SwipeWrppaer>
            <div className="swipe-info-box">
              <div className="title">Team</div>
              <div className="pagenation">
                <span>{currentMemberIdx}</span>
                <span className="border"></span>
                <span>{memberArrayData.length}</span>
              </div>
              <div className="arrow-group">
                <button
                  type="button"
                  onClick={() => {
                    if (currentMemberIdx === 1) {
                      return false;
                    } else {
                      setCurrentMemberIdx(currentMemberIdx - 1);
                    }
                  }}
                >
                  <div className="circle"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="239.398"
                    height="164.987"
                    viewBox="0 0 239.398 164.987"
                  >
                    <g transform="translate(-149.102 -434.108)">
                      <path
                        d="M136.911,499.6s49.913-15.781,49.913-46.255V417.108"
                        transform="translate(14 17)"
                        fill="none"
                        stroke="#000"
                        strokeWidth="12"
                      />
                      <path
                        d="M136.911,417.108s49.913,15.781,49.913,46.255V499.6"
                        transform="translate(14 99.493)"
                        fill="none"
                        stroke="#000"
                        strokeWidth="12"
                      />
                      <line
                        x2="238"
                        transform="translate(150.5 516.5)"
                        fill="none"
                        stroke="#000"
                        strokeWidth="12"
                      />
                    </g>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentMemberIdx === memberArrayData.length) {
                      return false;
                    } else {
                      setCurrentMemberIdx(currentMemberIdx + 1);
                    }
                  }}
                >
                  <div className="circle"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="239.398"
                    height="164.987"
                    viewBox="0 0 239.398 164.987"
                  >
                    <path
                      d="M186.824,499.6s-49.913-15.781-49.913-46.255V417.108"
                      transform="translate(50.765 -417.108)"
                      fill="none"
                      stroke="#000"
                      strokeWidth="12"
                    />
                    <path
                      d="M186.824,417.108s-49.913,15.781-49.913,46.255V499.6"
                      transform="translate(50.765 -334.615)"
                      fill="none"
                      stroke="#000"
                      strokeWidth="12"
                    />
                    <line
                      x1="238"
                      transform="translate(0 82.392)"
                      fill="none"
                      stroke="#000"
                      strokeWidth="12"
                    />
                  </svg>
                </button>
              </div>
              <UserNameGroup>
                <div className="user-name-slider" ref={sliderRef}>
                  {memberArrayData.map(user => (
                    <div className="user-name-box" key={user.user_idx}>
                      {user.name}
                    </div>
                  ))}
                </div>
              </UserNameGroup>
              <UserJobGroup>
                <div className="user-job-slider" ref={sliderJobRef}>
                  {memberArrayData.map(user => (
                    <div className="user-job-box" key={user.user_idx}>
                      {user.job}
                    </div>
                  ))}
                </div>
              </UserJobGroup>
            </div>
            <div className="swipe-gallery-box">
              <UserImgGroup>
                <div className="user-img-slider" ref={sliderImgRef}>
                  {memberArrayData.map(user => (
                    <UserImgBox
                      key={user.user_idx}
                      style={{
                        backgroundImage: `url('/images/img_user_${user.user_idx}.jpg')`,
                      }}
                    >
                      {/* {user.job} */}
                    </UserImgBox>
                  ))}
                </div>
              </UserImgGroup>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1440"
                height="1440.003"
                viewBox="0 0 1440 1440.003"
                className="slider-blackhole"
                preserveAspectRatio="none meet"
              >
                <path
                  d="M653,480l-720,0V-238.46C-66.172,157.7,256.818,480,653,480h0Zm720,0H653c396.025,0,719.015-322.189,720-718.216ZM-67-241.542h0V-960H651.46C256.125-959.174-66.174-636.876-67-241.542Zm1440-.241h0c-.981-395.2-323.279-717.392-718.456-718.216H1373Z"
                  transform="translate(67 960.001)"
                ></path>
              </svg>
            </div>
          </SwipeWrppaer>
          <ClientWrapper>
            <p className="title">
              Clients i wish i had <span className="sec-font">WORKED FOR:</span>
            </p>
            <ul>
              {clientArray.map(client => (
                <li key={client}>
                  <span>{client}</span>
                </li>
              ))}
            </ul>
          </ClientWrapper>
          <SkillWrapper>
            <p className="title">
              OUR <span className="sec-font">SKILLSET:</span>
            </p>
            <div className="row">
              <div className="box">REACT</div>
              <div className="box">NEXT JS</div>
            </div>
            <div className="row">
              <div className="box">NODE JS</div>
              <div className="box">EXPRESS</div>
            </div>
            <div className="row">
              <div className="box">HTML</div>
              <div className="box">JAVASCRIPT</div>
            </div>
            <div className="row">
              <div className="box">CSS / SCSS</div>
              <div className="box">SQL</div>
            </div>
          </SkillWrapper>
          <SnsWrapper>
            <p className="title">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <span className="sec-font">YOU</span> won't{" "}
              <span className="sec-font">FIND ME HERE</span>
            </p>
            <a href="https://www.naver.com/" target="_blank">
              <span>Twitter</span>
              <span className="arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="239.398"
                  height="164.987"
                  viewBox="0 0 239.398 164.987"
                >
                  <path
                    d="M186.824,499.6s-49.913-15.781-49.913-46.255V417.108"
                    transform="translate(50.765 -417.108)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                  <path
                    d="M186.824,417.108s-49.913,15.781-49.913,46.255V499.6"
                    transform="translate(50.765 -334.615)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                  <line
                    x1="238"
                    transform="translate(0 82.392)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                </svg>
              </span>
              <div className="mask"></div>
            </a>
            <a href="https://www.naver.com/" target="_blank">
              <span>facebook</span>
              <span className="arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="239.398"
                  height="164.987"
                  viewBox="0 0 239.398 164.987"
                >
                  <path
                    d="M186.824,499.6s-49.913-15.781-49.913-46.255V417.108"
                    transform="translate(50.765 -417.108)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                  <path
                    d="M186.824,417.108s-49.913,15.781-49.913,46.255V499.6"
                    transform="translate(50.765 -334.615)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                  <line
                    x1="238"
                    transform="translate(0 82.392)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                </svg>
              </span>
              <div className="mask"></div>
            </a>
            <a
              href="https://www.naver.com/"
              target="_blank"
              className="no-border"
            >
              <span>instagram</span>
              <span className="arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="239.398"
                  height="164.987"
                  viewBox="0 0 239.398 164.987"
                >
                  <path
                    d="M186.824,499.6s-49.913-15.781-49.913-46.255V417.108"
                    transform="translate(50.765 -417.108)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                  <path
                    d="M186.824,417.108s-49.913,15.781-49.913,46.255V499.6"
                    transform="translate(50.765 -334.615)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                  <line
                    x1="238"
                    transform="translate(0 82.392)"
                    fill="none"
                    stroke="#000"
                    strokeWidth="12"
                  />
                </svg>
              </span>
              <div className="mask"></div>
            </a>
          </SnsWrapper>
        </RightWrapperComponent>
      </Section>
      <FooterComponent />
      <EffectComponent text={effectTitle} rollingText={effectRollingText} />
    </MainWrapper>
  );
};

const SnsWrapper = styled.div`
  .title {
    font-size: 2vw;
    padding-left: 2vw;
    border-bottom: 4px solid #000;

    @media (max-width: ${breakpoints.md}px) {
      font-size: 20px;
    }
  }
  a {
    padding: 0 2vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 4px solid #000;
    overflow: hidden;
    position: relative;
    @media (max-width: ${breakpoints.md}px) {
      padding: 1vw 2vw;
    }

    &.no-border {
      border-bottom: none;
    }

    .mask {
      position: absolute;
      left: 0;
      top: 0;
      transform: translateY(100%);
      width: 100%;
      height: 100%;
      background-color: #000;
      display: block;
      transition: transform 150ms;
      z-index: -1;
    }

    span {
      &:first-child {
        color: #000;
        font-size: 3vw;
        text-transform: uppercase;
        transition: all 150ms;
        @media (max-width: ${breakpoints.md}px) {
          font-size: 34px;
        }
      }
      &.arrow {
        svg {
          width: 3vw;
          height: auto;
          * {
            stroke: #000;
            transition: all 150ms;
          }
        }
      }
    }

    &:hover {
      .mask {
        transform: translateY(0%);
        transition: transform 150ms;
      }

      span {
        &:first-child {
          color: #fff;
          transition: all 150ms;
        }
        &.arrow {
          svg {
            * {
              stroke: #fff;
              transition: all 150ms;
            }
          }
        }
      }
    }
  }
`;

const SkillWrapper = styled.div`
  /* border-bottom:4px solid #000; */
  padding-bottom: 6vw;

  .title {
    font-size: 2vw;
    border-bottom: 4px solid #000;
    text-align: center;
    padding: 0.5vw 0;
    @media (max-width: ${breakpoints.md}px) {
      font-size: 20px;
    }
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .box {
      flex: 1;
      font-size: 1.25vw;
      border-bottom: 4px solid #000;
      padding: 0.5vw 0;
      padding-left: 2vw;
      @media (max-width: ${breakpoints.md}px) {
        font-size: 16px;
        padding: 1vw 0;
        padding-left: 2vw;
      }

      &:first-child {
        border-right: 4px solid #000;
      }
    }
  }
`;

const ClientWrapper = styled.div`
  padding-top: 0.5vw;
  padding-left: 2vw;
  border-bottom: 4px solid #000;

  .title {
    font-size: 2vw;

    @media (max-width: ${breakpoints.md}px) {
      font-size: 20px;
    }

    > span {
      display: block;
    }
  }

  ul {
    display: flex;
    align-items: center;
    justify-content: end;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 6vw;
    padding-right: 10px;

    li {
      display: flex;
      align-items: center;
      justify-content: end;
      flex: 20% 0 0;
      margin-top: 16px;

      @media (max-width: ${breakpoints.md}px) {
        flex: 50% 0 0;
        margin-top: 8px;
      }

      > span {
        font-size: 16px;
        @media (max-width: ${breakpoints.md}px) {
          font-size: 13px;
        }
      }

      &::before {
        content: "";
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 10px;
        background-color: #000;
        margin-right: 12px;
        @media (max-width: ${breakpoints.md}px) {
          width: 10px;
          height: 10px;
          margin-right: 4px;
        }
      }
    }
  }
`;

const UserImgBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 100% 0 0;
  height: 100%;
  text-transform: uppercase;

  background-position: center;
  background-size: cover;
`;

const UserJobGroup = styled.div`
  overflow: hidden;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0.5vw;
  z-index: 20;

  .user-job-slider {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    transition: 300ms transform 100ms;

    .user-job-box {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 100% 0 0;
      text-transform: uppercase;
    }
  }
`;

const UserImgGroup = styled.div`
  overflow: hidden;
  width: 100%;
  height: 40vw;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;

  @media (max-width: ${breakpoints.md}px) {
    width: 100%;
    height: 100%;
  }

  .user-img-slider {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    transition: 300ms transform;

    .user-img-box {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 100% 0 0;
      height: 100%;
      font-size: 1.8vw;
      font-weight: bold;
      text-transform: uppercase;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
`;

const UserNameGroup = styled.div`
  overflow: hidden;
  width: 100%;
  height: 40vw;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;

  .user-name-slider {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    transition: 300ms transform;

    .user-name-box {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 100% 0 0;
      height: 100%;
      font-size: 1.8vw;
      font-weight: bold;
      text-transform: uppercase;
      @media (max-width: ${breakpoints.md}px) {
        font-size: 30px;
      }
    }
  }
`;

const SwipeWrppaer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 4px solid #000;
  overflow: hidden;
  @media (max-width: ${breakpoints.md}px) {
    flex-direction: column-reverse;
  }

  > div {
    flex: 1;
    height: 40vw;
    position: relative;

    @media (max-width: ${breakpoints.md}px) {
      flex: auto;
      width: 100%;
    }

    &.swipe-info-box {
      .title {
        position: absolute;
        left: 2vw;
        top: 0.5vw;
        font-size: 30px;
      }
      .pagenation {
        position: absolute;
        right: 2vw;
        top: 0.5vw;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        > .border {
          width: 1px;
          height: 14px;
          display: inline-block;
          background-color: #000;
          margin: 0 8px;
        }
      }

      .arrow-group {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        width: calc(100% - 4vw);
        align-items: center;
        justify-content: space-between;
        z-index: 30;

        button {
          position: relative;
          border: none;
          background-color: transparent;
          cursor: pointer;

          svg {
            width: 30px;
            height: 28px;
            position: relative;
            z-index: 20;
            transition: 300ms all;
          }

          .circle {
            opacity: 0;
            width: 1px;
            height: 1px;
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            transition: 300ms all;
          }

          &:hover {
            .circle {
              width: 80px;
              height: 80px;
              border-radius: 40px;
              background-color: #000;
              opacity: 1;
              transition: 300ms all;
            }
            svg {
              * {
                stroke: #fff;
                transition: 300ms all;
              }
            }
          }
        }
      }
    }

    &.swipe-gallery-box {
      @media (max-width: ${breakpoints.md}px) {
        flex: auto;
        width: calc(100vw - 40px);
        height: calc(100vw - 40px);
      }
      .slider-blackhole {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        fill: #000;
        overflow: hidden;
        z-index: 40;
      }
    }
  }
`;

const CenterInfo = styled.div`
  padding-top: 0.5vw;
  padding-left: 2vw;
  border-bottom: 4px solid #000;

  @media (max-width: ${breakpoints.md}px) {
    padding: 2vw;
  }

  > div {
    width: 47vw;
    margin-bottom: 60px;

    @media (max-width: ${breakpoints.md}px) {
      width: 100%;
    }

    > p {
      font-size: 30px;
      word-break: keep-all;
    }
    div.flex {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-top: 10px;
      > p {
        flex: 1;
        word-break: keep-all;
        font-size: 13px;
      }
      p + p {
        margin-left: 20px;
      }
    }
  }
`;

const Title = styled.div`
  border-top: 4px solid #000;
  border-bottom: 4px solid #000;
  overflow: hidden;
  * {
    line-height: 1;
    font-weight: bold;
  }
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
    padding: 10px;
    padding-right: 50px;
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
export default AboutWrapper;
