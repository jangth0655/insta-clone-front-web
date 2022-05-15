import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

export const GlobalStyles = createGlobalStyle`
  ${reset}
  input {
      all:unset;
    }
    * {
      box-sizing:border-box;
    }
    body { 
      background-color: ${(props) => props.theme.bgColor};
        font-size:14px;
        font-family:'Open Sans', sans-serif;
        color: ${(props) => props.theme.fontColor};
    }
    a {
      text-decoration: none;
    }
`;
