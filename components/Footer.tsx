"use client";

import React from "react";
import Image from "next/image";
import styled from "styled-components";
import LeftWrapperComponent from "./LeftWrapper";
import RightWrapperComponent from "./RightWrapper";
import { breakpoints } from "@/config/breakboint";
import { siteProfile } from "@/config/profile";

function FooterComponent() {
  const footerCopy = (
    <>
      SERVICE-ORIENTED DEVELOPER
      <br />
      BUILDING PRODUCT FLOWS
      <br />
      TYPESCRIPT / API / VALIDATION
      <br />
      <span className="sec-font">{siteProfile.email.toUpperCase()}</span>
    </>
  );

  return (
    <FooterWrapper>
      <LeftWrapperComponent>
        <div className="border-group" aria-hidden="true">
          <div className="vertical-group">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="horizontal-group">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </LeftWrapperComponent>
      <RightWrapperComponent>
        <InfoMobile className="tablet">
          <p>{footerCopy}</p>
        </InfoMobile>

        <div className="footer-info-group">
          <div className="info pc">
            <p>{footerCopy}</p>
          </div>
          <div className="sns" aria-label="Social links">
            {siteProfile.socials.map(social => (
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} 새 탭에서 열기`}
                key={social.label}
              >
                <Image src={social.icon} alt="" width={24} height={24} />
              </a>
            ))}
            <a href={`mailto:${siteProfile.email}`} aria-label="이메일 보내기">
              <span className="mail-icon">@</span>
            </a>
          </div>
          <button
            className="top"
            type="button"
            aria-label="맨 위로 이동"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ArrowSvg className="black-arrow" stroke="#000" />
            <ArrowSvg className="white-arrow" stroke="#fff" />
            <div className="mask"></div>
          </button>
        </div>
      </RightWrapperComponent>
    </FooterWrapper>
  );
}

const ArrowSvg = ({
  className,
  stroke,
}: {
  className: string;
  stroke: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="164.987"
    height="239.398"
    viewBox="0 0 164.987 239.398"
    className={className}
    aria-hidden="true"
  >
    <g transform="translate(0 239.398) rotate(-90)">
      <path
        d="M186.824,499.6s-49.913-15.781-49.913-46.255V417.108"
        transform="translate(50.765 -417.108)"
        fill="none"
        stroke={stroke}
        strokeWidth="12"
      />
      <path
        d="M186.824,417.108s-49.913,15.781-49.913,46.255V499.6"
        transform="translate(50.765 -334.615)"
        fill="none"
        stroke={stroke}
        strokeWidth="12"
      />
      <line
        x1="238"
        transform="translate(0 82.392)"
        fill="none"
        stroke={stroke}
        strokeWidth="12"
      />
    </g>
  </svg>
);

const InfoMobile = styled.div`
  width: 100%;
  height: 25vw;
  border-bottom: 4px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    font-size: 16px;
    line-height: 18px;
    text-align: center;
  }
`;

const FooterWrapper = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .footer-info-group {
    width: 100%;
    height: 25vw;
    background-color: #fff;
    position: relative;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: ${breakpoints.md}px) {
      height: 45vw;
    }

    > div,
    > button {
      flex: 1;
      height: 100%;
      border-right: 4px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .info {
      p {
        font-size: 16px;
        line-height: 18px;
        text-align: center;
      }
    }

    .sns {
      a {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px 0;
        font-weight: 900;
      }

      .mail-icon {
        font-size: 22px;
        line-height: 1;
      }
    }

    .top {
      cursor: pointer;
      position: relative;
      overflow: hidden;

      > .mask {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #000;
        z-index: 10;
        transform: translateY(100%);
        transition: 300ms;
      }

      > svg.black-arrow {
        position: relative;
        z-index: 20;
        width: 20px;
      }

      > svg.white-arrow {
        position: absolute;
        z-index: 20;
        width: 20px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -150%);
        transition: 300ms;
      }

      &:hover,
      &:focus-visible {
        > .mask {
          transform: translateY(0%);
        }

        > svg.white-arrow {
          transform: translate(-50%, -50%);
        }
      }
    }

    > :last-child {
      border: none;
    }
  }

  .border-group {
    position: relative;
    width: 100%;
    height: 25vw;

    .vertical-group {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;

      > div {
        width: 4px;
        height: 100%;
        background-color: #000;
      }
    }

    .horizontal-group {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;

      > div {
        width: 100%;
        height: 4px;
        background-color: #000;
      }
    }
  }
`;

export default FooterComponent;
