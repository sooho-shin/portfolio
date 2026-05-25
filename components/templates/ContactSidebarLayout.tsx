"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import { useWindowScroll, useWindowSize } from "react-use";
import LeftWrapperComponent from "@/components/LeftWrapper";
import RightWrapperComponent from "@/components/RightWrapper";
import PageSection from "@/components/atoms/PageSection";
import ContactInfoPanel from "@/components/molecules/ContactInfoPanel";

type Props = {
  children: ReactNode;
};

const ContactSidebarLayout = ({ children }: Props) => {
  const mainContainer = useRef<HTMLDivElement | null>(null);
  const infoText = useRef<HTMLDivElement | null>(null);
  const { y: scrollY } = useWindowScroll();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    if (infoText.current && mainContainer.current) {
      const mainHeight = mainContainer.current.offsetHeight;
      if (windowHeight + scrollY > mainHeight) {
        infoText.current.style.transform = `translate3d(0px,-${
          windowHeight + scrollY - mainHeight
        }px,0px)`;
      } else {
        infoText.current.style.transform = "translate3d(0px,0px,0px)";
      }
    }
  }, [scrollY, windowHeight, windowWidth]);

  return (
    <PageSection ref={mainContainer}>
      <LeftWrapperComponent>
        <ContactInfoPanel infoRef={infoText} />
      </LeftWrapperComponent>
      <RightWrapperComponent>{children}</RightWrapperComponent>
    </PageSection>
  );
};

export default ContactSidebarLayout;
