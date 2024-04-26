import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import styled, { css,keyframes } from 'styled-components'
import LeftWrapperComponent from './LeftWrapper';
import RightWrapperComponent from './RightWrapper';
import IcoTwitter from "../public/images/ico_twitter.png"
import IcoFacebook from "../public/images/ico_facebook.png"
import IcoInsta from "../public/images/ico_insta.png"

function FooterComponent(){
  

    return (
      <FooterWrapper>
        <LeftWrapperComponent>
          <div className="border-gorup">
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
              <p>
                Sooho zzang<br/>
                show me the money<br/>
                black sheep wall<br/>
                <span className="sec-font">SOOJOON92@GMAIL.COM</span>
              </p>
            </InfoMobile>
          <div className="footer-info-group">
            <div className="info pc">
              <p>
                Sooho zzang<br/>
                show me the money<br/>
                black sheep wall<br/>
                <span className="sec-font">SOOJOON92@GMAIL.COM</span>
              </p>
            </div>
            <div className="sns">
              <a href="https://www.naver.com/" target="_blank">
                <img src={IcoTwitter} alt="icoTwitter"/>
              </a>

              <a href="https://www.naver.com/" target="_blank">
                <img src={IcoFacebook} alt="icoFacebook"/>
              </a>

              <a href="https://www.naver.com/" target="_blank">
                <img src={IcoInsta} alt="icoInsta"/>
              </a>
            </div>
            <div className="top" onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'});}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="164.987" height="239.398" viewBox="0 0 164.987 239.398" className="black-arrow">
              <g transform="translate(0 239.398) rotate(-90)">
                <path d="M186.824,499.6s-49.913-15.781-49.913-46.255V417.108" transform="translate(50.765 -417.108)" fill="none" stroke="#000" strokeWidth="12"/>
                <path d="M186.824,417.108s-49.913,15.781-49.913,46.255V499.6" transform="translate(50.765 -334.615)" fill="none" stroke="#000" strokeWidth="12"/>
                <line x1="238" transform="translate(0 82.392)" fill="none" stroke="#000" strokeWidth="12"/>
              </g>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="164.987" height="239.398" viewBox="0 0 164.987 239.398" className="white-arrow">
              <g transform="translate(0 239.398) rotate(-90)">
                <path d="M186.824,499.6s-49.913-15.781-49.913-46.255V417.108" transform="translate(50.765 -417.108)" fill="none" stroke="#fff" strokeWidth="12"/>
                <path d="M186.824,417.108s-49.913,15.781-49.913,46.255V499.6" transform="translate(50.765 -334.615)" fill="none" stroke="#fff" strokeWidth="12"/>
                <line x1="238" transform="translate(0 82.392)" fill="none" stroke="#fff" strokeWidth="12"/>
              </g>
            </svg>
            <div className="mask"></div>
            </div>
          </div>
        </RightWrapperComponent>
      </FooterWrapper>
    )
}   

const InfoMobile = styled.div`
  width:100%;
  height:25vw;
  border-bottom:4px solid #000;
  display:flex;
  align-items:center;
  justify-content:center;

  p {
      font-size:16px;
      line-height:18px;
      text-align:center;
    }
`

const FooterWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;

  .footer-info-group{
    width:100%;
    height:25vw;
    background-color:#fff;
    position: relative;
    z-index:100;
    display:flex;
    align-items:center;
    justify-content:space-between;

    >div{
      flex:1;
      height:100%;
      border-right:4px solid #000;
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;

      &.info{
        p {
          font-size:16px;
          line-height:18px;
          text-align:center;
        }
      }

      &.sns{
        a{
          width:20px;
          height:20px;
          display:block;
          margin:10px 0;
          >img{
            width:100%;
          }
        }
      }

      &.top{
        cursor:pointer;
        position: relative;
        overflow:hidden;

        >.mask{
          display:block;
          width:100%;
          height:100%;
          position:absolute;
          left:0;
          top:0;
          background-color:#000;
          z-index:10;
          transform:translateY(100%);
          transition:300ms;
        }

        >svg.black-arrow{
          position: relative;
          z-index:20;
          width:20px;
        }

        >svg.white-arrow{
          position: absolute;
          z-index:20;
          width:20px;
          left:50%;
          top:50%;
          transform:translate(-50%,-150%);
          transition:300ms;
        }
        
        &:hover{
          >.mask{
            transform:translateY(0%);
            transition:300ms;
          }
          >svg.white-arrow{
            transform:translate(-50%,-50%);
            transition:300ms;
          }
        }
      }

      &:last-child {
        border:none;
      }
    }
  }

  .border-gorup{
    position: relative;
    width:100%;
    height:25vw;

    .vertical-group{
      display:flex;
      align-items:center;
      justify-content:space-evenly;
      width:100%;
      height:100%;
      position:absolute;
      top:0;
      left:0;

      > div{
        width:4px; 
        height:100%;
        background-color:#000;
      }
    }
    .horizontal-group{
      display:flex;
      align-items:center;
      justify-content:space-evenly;
      flex-direction:column;
      width:100%;
      height:100%;
      position:absolute;
      top:0;
      left:0;

      > div {
        width:100%; 
        height:4px;
        background-color:#000;
      }
    }
  }
`

export default FooterComponent;