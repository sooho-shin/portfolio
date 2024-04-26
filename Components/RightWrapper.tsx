import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { breakpoints } from '../context/breakpoint'


type Props = {
  children?: ReactNode
}

const RightWrapperComponent = ({children}:Props) => (
  <RightWrapper>
    {children}
  </RightWrapper>
)
const RightWrapper = styled.div`
  width: calc(75vw);
  position: relative;
  @media (max-width: ${breakpoints.md}px) {
    width: calc(100vw - 40px);
    margin-left:40px;
  }
`

export default RightWrapperComponent
