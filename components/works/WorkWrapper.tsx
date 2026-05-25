"use client";

import React from "react";
import styled from "styled-components";
import { breakpoints } from "@/config/breakboint";
import GalleryBox from "@/components/GalleryBox";
import Link from "next/link";
import ContactSidebarLayout from "@/components/templates/ContactSidebarLayout";
import PortfolioPageShell from "@/components/templates/PortfolioPageShell";

const WorkWrapper = () => {
  const effectTitle = "work";
  const effectRollingText = "SOOHO work";

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
    <PortfolioPageShell
      effectTitle={effectTitle}
      effectRollingText={effectRollingText}
    >
      <ContactSidebarLayout>
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
      </ContactSidebarLayout>
    </PortfolioPageShell>
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

export default WorkWrapper;
