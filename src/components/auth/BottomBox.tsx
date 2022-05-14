import { Link } from "react-router-dom";
import styled from "styled-components";
import { BaseBox } from "../shared";

const SBottomBox = styled(BaseBox)`
  padding: 20px 0px;
  text-align: center;
  a {
    font-weight: 600;
    margin-left: 3px;
    color: ${(props) => props.theme.accent};
  }
`;

interface BottomBoxProps {
  ctx: string;
  link: any;
  linkText: string;
}

const BottomBox = ({ ctx, link, linkText }: BottomBoxProps) => {
  return (
    <SBottomBox>
      <span>{ctx}</span> <Link to={link}>{linkText}</Link>
    </SBottomBox>
  );
};

export default BottomBox;
