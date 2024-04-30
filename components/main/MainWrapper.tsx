import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { breakpoints } from "@/config/breakboint";
import LeftWrapperComponent from "@/components/LeftWrapper";
import RightWrapperComponent from "@/components/RightWrapper";
import { Textfit } from "react-textfit";
import Link from "next/link";
import FooterComponent from "@/components/Footer";
import EffectComponent from "@/components/EffectBox";
import { Playfair_Display } from "next/font/google";
import classNames from "classnames";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});
const MainWrapper = () => {
  const [effectTitle] = useState("home");
  const [effectRollingText] = useState("SOOHO ZZANG");
  const [hoverState, setHoverState] = useState<boolean>(false);

  return (
    <Wrapper>
      <Section>
        <LeftWrapperComponent>
          <InfoBox>
            <div className="info-left">
              <p>
                Contact details on the home page are a good idea, we were told:
              </p>
            </div>
            <div className="info-right">
              <p>
                Blumenkopf kein Studio
                <br />
                Burgring 123
                <br />
                1010 Wien, Austria
              </p>
              <a href="#">soojoon92@gmail.com</a>
            </div>
          </InfoBox>
        </LeftWrapperComponent>
        <RightWrapperComponent>
          <TopRightInfo>
            <div className="left">
              <span>
                We do little
                <br />
                to none:
              </span>
              <span>
                Editorial
                <br />
                Print
                <br />
                Graphicdesign
                <br />
                Branding
                <br />
                illustration
              </span>
            </div>
            <div className="right">
              <span>
                Blumenkopf is no
                <br />
                studio. with everything{" "}
                <span className="sec-font">you need</span>
              </span>
            </div>
          </TopRightInfo>
          <MainBgContainer />
          <BlackholePositioner>
            <div className="js-blackhole-pinner blackhole-pinner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 1440 1440.003"
                className="blackhole"
                preserveAspectRatio="none meet"
              >
                <path
                  id="blackhole"
                  d="M653,480l-720,0V-238.46C-66.172,157.7,256.818,480,653,480h0Zm720,0H653c396.025,0,719.015-322.189,720-718.216ZM-67-241.542h0V-960H651.46C256.125-959.174-66.174-636.876-67-241.542Zm1440-.241h0c-.981-395.2-323.279-717.392-718.456-718.216H1373Z"
                  transform="translate(67 960.001)"
                  data-v-3a229bb7=""
                ></path>
              </svg>
            </div>
          </BlackholePositioner>
        </RightWrapperComponent>
      </Section>
      <Section className="tablet">
        <CenterTextMobile>
          <div className="info-left">
            <p>
              We do little to none:
              <br />
            </p>
            <p>
              Editorial
              <br /> Print
              <br /> Graphicdesign
              <br /> Branding
              <br /> Illustration
            </p>
          </div>
          <div className="info-right">
            <p>
              Blumenkopf
              <br />
              is no studio.
              <br />
              with
              <br />
              Everything
              <br />
              <span className={playfair.className}>you need.</span>
            </p>
          </div>
        </CenterTextMobile>
      </Section>
      <Section className="tablet">
        <InfoBoxMobile>
          <div className="info-left">
            <p>
              Contact details on the home page are a good idea, we were told:
            </p>
          </div>
          <div className="info-right">
            <p>
              Blumenkopf kein Studio
              <br />
              Burgring 123
              <br />
              1010 Wien, Austria
              <br />
              <span className="sec-font">BLUMENKOPF@GMAIL.COM</span>
            </p>
          </div>
        </InfoBoxMobile>
      </Section>
      <Section className="no-border home-about">
        <LeftWrapperComponent>
          <AboutLeft>
            <p className="title">Clients we have not worked for at all:</p>
            <ul className="brand-list">
              <li>Adidas</li>
              <li>Nike</li>
              <li>Gucci</li>
              <li>Apple</li>
              <li>Versace</li>
              <li>Netflix</li>
            </ul>
          </AboutLeft>
        </LeftWrapperComponent>
        <RightWrapperComponent>
          <AboutRight>
            <div className="left tablet">
              <p className="title">Clients we have not worked for at all:</p>
              <ul className="brand-list">
                <li>Adidas</li>
                <li>Nike</li>
                <li>Gucci</li>
                <li>Apple</li>
                <li>Versace</li>
                <li>Netflix</li>
              </ul>
            </div>
            <div className="right">
              <div className="top-text">
                <p>
                  Where beauty goes the eyes might follow.
                  <span className="sec-font">Yet often it is missing.</span>
                  But not with us. Because we don t design.
                </p>
                <p>Still, we can help since that depends on how it looks.</p>
              </div>
              <div className="bottom-text">
                <p>
                  Quite strange is the appearance,
                  <span className="sec-font"> just right </span>
                  we would assume.
                </p>
              </div>
              <Link prefetch href={"/about"} passHref>
                <StyledButton>About</StyledButton>
              </Link>
            </div>
          </AboutRight>
        </RightWrapperComponent>
      </Section>
      <Section className="no-border fd-c center-text">
        <Textfit
          style={{ width: "100%", height: "auto" }}
          max={9999}
          mode="single"
          forceSingleModeWidth={true}
        >
          SooHoZZANG
        </Textfit>
        <div className="text-right">
          <Link prefetch href={"/work"} passHref>
            <StyledButton className="right">Work</StyledButton>
          </Link>
        </div>
      </Section>
      <ProjectWrapper hover={hoverState}>
        <LeftWrapperComponent></LeftWrapperComponent>
        <RightWrapperComponent>
          <div
            className="gallery"
            onMouseEnter={() => setHoverState(true)}
            onMouseLeave={() => setHoverState(false)}
          >
            <div className="content">
              <div className="project-box">
                <div className="project first"></div>
                <div className="project second"></div>
                <div className="project third"></div>
              </div>
              <div className="text-loop-container top">
                <div className="loop-box">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>test</span>
                  ))}
                </div>
                <div className="loop-box">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>test</span>
                  ))}
                </div>
              </div>

              <div className="text-loop-container right">
                <div className="loop-box">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>test</span>
                  ))}
                </div>
                <div className="loop-box">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>test</span>
                  ))}
                </div>
              </div>

              <div className="text-loop-container left">
                <div className="loop-box">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>test</span>
                  ))}
                </div>
                <div className="loop-box">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>test</span>
                  ))}
                </div>
              </div>

              <div className="text-loop-container bottom">
                <div className="loop-box">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>test</span>
                  ))}
                </div>
                <div className="loop-box">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>test</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RightWrapperComponent>
      </ProjectWrapper>
      <FooterComponent />

      <EffectComponent text={effectTitle} rollingText={effectRollingText} />
    </Wrapper>
  );
};

const InfoBoxMobile = styled.div`
  padding: 1.5vw;
  display: flex;
  justify-content: space-between;
  width: calc(100vw - 40px);
  margin-left: 40px;
  font-size: 14px;

  .info-left {
    flex: 30vw 0 0;
  }
  .info-right {
    width: 100%;
    padding-left: 5vw;
    /* font-size: 11vw;
    letter-spacing: -2px;
    line-height: 0.85em;
    text-transform: uppercase; */
  }
`;

const CenterTextMobile = styled.div`
  padding: 1.5vw;
  display: flex;
  justify-content: space-between;
  width: calc(100vw - 40px);
  margin-left: 40px;
  font-size: 14px;

  .info-left {
    flex: 30vw 0 0;
  }

  .info-right {
    width: 100%;
    padding-left: 5vw;
    font-size: 9vw;
    letter-spacing: -2px;
    line-height: 0.85em;
    text-transform: uppercase;
  }
`;

const MainBgContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url("/images/main.jpeg");
  background-position: center;
  background-size: cover;
`;

const productShowAniFirst = keyframes`
  0%{
    opacity:1;
    transform:translate(-50%,-50%) rotate(0deg);
  }
  50%{
    transform:translate(-50%,-50%) rotate(3deg);
    opacity:1;
  }
  100%{
    transform:translate(-50%,-50%) rotate(1deg);
    opacity:1;
  }
`;

const productShowAniSecond = keyframes`
  0%{
    opacity:1;
    transform:translate(-50%,-50%) rotate(6deg);
  }
  50%{
    transform:translate(-51%,-49%) rotate(4deg);
    opacity:1;
  }
  100%{
    transform:translate(-51%,-49%) rotate(8deg);
    opacity:1;
  }
`;

const productShowAniThird = keyframes`
  0%{
    opacity:1;
    transform:translate(-50%,-50%) rotate(-2deg);
  }
  50%{
    transform:translate(-51%,-49%) rotate(-6deg);
    opacity:1;
  }
  100%{
    transform:translate(-52%,-49%) rotate(-4deg);
    opacity:1;
  }
`;

const productShowAniFirstReverse = keyframes`
  0%{
    transform:translate(-50%,-50%) rotate(1deg);
    opacity:1;
  }
  50%{
    transform:translate(-50%,-50%) rotate(3deg);
    opacity:1;
  }
  100%{
    opacity:1;
    transform:translate(-50%,-50%) rotate(0deg);
  }
`;

const productShowAniSecondReverse = keyframes`
  0%{
    transform:translate(-51%,-49%) rotate(8deg);
    opacity:1;
  }
  50%{
    transform:translate(-51%,-49%) rotate(4deg);
    opacity:1;
  }
  100%{
    opacity:0;
    transform:translate(-50%,-50%) rotate(6deg);
  }
`;

const productShowAniThirdReverse = keyframes`
  0%{
    transform:translate(-52%,-49%) rotate(-4deg);
    opacity:1;
  }
  50%{
    transform:translate(-51%,-49%) rotate(-6deg);
    opacity:1;
  }
  100%{
    opacity:0;
    transform:translate(-50%,-50%) rotate(-2deg);
  }
`;

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

const ProjectWrapper = styled.div<{ hover: boolean }>`
  width: 100%;
  display: flex;
  height: 49.5vw;
  margin-top: -10vw;
  border-bottom: 4px solid #000;
  @media (max-width: ${breakpoints.md}px) {
    display: block;
    height: 70vw;
    margin-top: 0;
  }

  ${props =>
    props.hover
      ? css`
          .project {
            &.first {
              animation: ${productShowAniFirst} step-end 500ms alternate
                forwards;
            }
            &.second {
              animation: ${productShowAniSecond} step-end 500ms alternate
                forwards 100ms;
            }
            &.third {
              animation: ${productShowAniThird} step-end 500ms alternate
                forwards 200ms;
            }
          }
        `
      : css`
          .project {
            &.first {
              animation: ${productShowAniFirstReverse} step-end 500ms forwards
                100ms;
            }
            &.second {
              animation: ${productShowAniSecondReverse} step-end 500ms forwards
                200ms;
            }
            &.third {
              animation: ${productShowAniThirdReverse} step-end 500ms forwards;
            }
          }
        `};
  .gallery {
    background-color: #fff;
    display: inline-block;
    z-index: 100;
    position: absolute;
    width: 37vw;
    height: 49.5vw;
    left: -4px;
    cursor: pointer;
    @media (max-width: ${breakpoints.md}px) {
      display: block;
      width: 50vw;
      height: 70vw;
    }

    .content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: relative;
      padding: 8vw;

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
          background-image: url("/images/img_product_first.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: translate(-50%, -50%);
        }
        &.second {
          background-image: url("/images/img_product_second.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: translate(-50%, -50%) rotate(6deg);
          opacity: 0;
        }
        &.third {
          background-image: url("/images/img_product_third.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: translate(-50%, -50%) rotate(-2deg);
          opacity: 0;
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
          height: 3vw;
        }
        &.bottom {
          bottom: 0;
          left: 0;
          height: 3vw;
          .loop-box {
            animation: ${textLoopAni} linear 10s reverse infinite;
          }
        }
        &.right {
          height: 100%;
          top: 0;
          right: 0;
          width: 3vw;
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
          width: 3vw;
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
          display: inline-flex;
          animation: ${textLoopAni} linear 10s normal infinite;
          > span {
            font-size: 1.5vw;
            margin: 0.5vw 0.3vw;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            &:nth-child(2n) {
              opacity: 0.7;
            }
          }
        }
      }
    }
  }
`;

const StyledButton = styled.div`
  display: inline-block;
  padding: 8px 60px 8px 10px;
  color: #fff !important;
  background-color: #000;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  border: 1px solid #000;
  box-sizing: border-box;
  position: relative;
  width: max-content;
  left: 14vw;
  cursor: pointer;
  z-index: 50;

  &.right {
    left: auto;
    right: 2vw;
  }
  &:hover {
    color: #000 !important;
    background-color: #fff;
  }
`;

const AboutRight = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  @media (max-width: ${breakpoints.md}px) {
    padding: 1.5vw;
  }
  > div {
    .top-text {
      font-size: 30px;
      max-width: 300px;
      position: relative;
      left: 14vw;
      text-transform: uppercase;

      p {
        text-indent: 2vw;
      }

      @media (max-width: ${breakpoints.md}px) {
        font-size: 16px;
        left: 0;
      }
    }

    .bottom-text {
      font-size: 30px;
      max-width: 300px;
      position: relative;
      left: 8vw;
      text-transform: uppercase;
      margin-bottom: 8vw;

      p {
        text-indent: 2vw;
      }

      @media (max-width: ${breakpoints.md}px) {
        font-size: 16px;
        left: 0;
        margin-bottom: 4vw;
      }
    }
    @media (max-width: ${breakpoints.md}px) {
      &.left {
        flex: 30vw 0 0;
        display: flex !important;
        flex-direction: column;

        ul.brand-list {
          margin-top: 6px;
          display: flex;
          flex-direction: column;

          > li {
            display: flex;
            align-items: center;
            justify-content: end;
            line-height: 1px;
            padding: 2px 0;
            font-size: 14px;

            &::before {
              content: "";
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 4px;
              background-color: #000;
              margin-right: 4px;
            }
          }
        }
      }
      &.right {
        width: 100%;
        padding-left: 5vw;
      }
    }
    a {
      left: 14vw;
    }
  }
`;

const AboutLeft = styled.div`
  padding: 10px;

  > p.title {
    max-width: 156px;
    word-break: keep-all;
    font-size: 13px;
  }

  ul.brand-list {
    margin-top: 6px;
    > li {
      display: flex;
      align-items: center;
      justify-content: end;
      line-height: 1px;
      padding: 2px 0;
      font-size: 18px;

      &::before {
        content: "";
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background-color: #000;
        margin-right: 8px;
      }
    }
  }
`;

const TopRightInfo = styled.div`
  width: 100%;
  height: 100vw;

  @media (max-width: ${breakpoints.md}px) {
    /* width: 100vw; */
    height: 100vw;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  .left {
    display: flex;
    flex-direction: column;
    @media (max-width: ${breakpoints.md}px) {
      display: none;
    }

    span {
      font-size: 13px;
      display: inline-block;
      &:first-child {
        margin-bottom: 40px;
      }
    }
  }

  .right {
    width: 45vw;
    margin-left: 2vw;
    @media (max-width: ${breakpoints.md}px) {
      display: none;
    }
    span {
      word-break: keep-all;
      font-size: 7vw;
      line-height: 6vw;
      text-transform: uppercase;
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
const BlackholePositioner = styled.div`
  top: 0;
  right: 0;
  margin-top: -2px;
  position: fixed;
  display: flex;
  justify-content: center;
  width: calc(75vw + 1px);
  @media (max-width: ${breakpoints.md}px) {
    position: absolute;
    width: 100vw;
    height: 100vw;
    margin-top: 0;
  }
  z-index: 60;
  overflow: hidden;
  pointer-events: none;

  .blackhole-pinner {
    transform: translate(0px, 0px) !important;
  }
  .blackhole-pinner {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .blackhole {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100.1vh;
    //min-height: calc(var(--vh, 1vh) * 100.1);
    min-width: 100.1vh;
    //min-width: calc(var(--vh, 1vh) * 100.1);
    //fill: var(--lines-color);
    @media (max-width: ${breakpoints.md}px) {
      min-width: auto;
      min-height: auto;
    }
  }
`;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  @media (max-width: ${breakpoints.md}px) {
  }
  /* justify-content: center; */
`;

// const LeftWrapper = styled.div`
//   width: calc(25vw);
//   padding-right:40px;

//   /* border-right:2px solid #000; */
//   box-sizing:border-box;
// `

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: flex-end;
  width: 100%;
  height: 530px;
  padding: 10px;
  border-bottom: 4px solid #000;
  font-size: 13px;

  > .info-left {
    p {
      max-width: 100px;
      word-break: keep-all;
    }
  }
  > .info-right {
    padding-left: 30px;
    p {
      word-break: keep-all;
    }
    a {
      display: block;
      text-transform: uppercase;
      word-break: break-word;
    }
  }
`;

export default MainWrapper;
