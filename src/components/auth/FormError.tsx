import styled from "styled-components";

const SFormError = styled.span`
  color: tomato;
  font-weight: 600;
  font-size: 12px;
  display: block;
  margin: 10px 0;
`;

interface FormErrorMessage {
  message?: string;
}

const FormError = ({ message }: FormErrorMessage) => {
  return <SFormError>{message}</SFormError>;
};

export default FormError;
