import { createGlobalStyle } from "styled-components";
import { breakpoints } from "@/config/breakboint";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        color: inherit;
        -webkit-text-size-adjust: 100%;
    }
    *,
    :after,
    :before {
        box-sizing: border-box;
    }
    :root {
        -webkit-tap-highlight-color: transparent;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
        cursor: default;
        line-height: 1.5;
        overflow-wrap: break-word;
        -moz-tab-size: 4;
        tab-size: 4;
    }
    html,
    body {
        //height: 100%;
        transition: none;
    }
    
    img,
    picture,
    video,
    canvas,
    svg {
        display: block;
        max-width: 100%;
    }
    
    a,
    button,
    [role="button"] {
        cursor: pointer;
    }

    button {
        background: none;
        border: 0;
    }
    
    a {
        text-decoration: none;
    }

    button:disabled,
    [aria-disabled="true"] {
        cursor: default;
    }

    :focus-visible {
        outline: 3px solid #000;
        outline-offset: 3px;
    }
    
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    ul {
        list-style: none;
    }

    input,
    textarea {
        background-color: transparent;
        border: none;
        outline: none;
        padding: 0;
        margin: 0;
        &::placeholder {
        }
    }
    .tablet{
        @media (min-width: ${breakpoints.md + 1}px) {
            display: none !important;
        }
    }
    .pc{
        @media (max-width: ${breakpoints.md}px) {
            display:none !important;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
        }
    }

`;

export default GlobalStyles;
