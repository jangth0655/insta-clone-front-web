import styled from "styled-components";

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  border-radius: 3px;
  padding: 7px;
  background-color: #fafafa;
  border: 0.5px solid
    ${(props) => (props.hasError ? "tomato" : "rgb(219, 219, 219)")};
  margin-top: 5px;
  box-sizing: border-box;
  &::placeholder {
    font-size: 12px;
  }
  &:focus {
    border: 1px solid rgb(38, 38, 38);
  }
`;

export default Input;
