import styled from "styled-components";
import { FatText } from "../shared";

const CommentContainer = styled.div`
  margin-top: 20px;
`;

const CommentCaption = styled.span`
  margin-left: 10px;
`;

interface CommentDetailProps {
  user?: {
    username?: string | null;
    avatar?: string | null;
  } | null;
  payload?: string | null;
}

const CommentDetail = ({ user, payload }: CommentDetailProps) => {
  return (
    <CommentContainer>
      <FatText>{user?.username}</FatText>
      <CommentCaption>{payload}</CommentCaption>
    </CommentContainer>
  );
};

export default CommentDetail;
