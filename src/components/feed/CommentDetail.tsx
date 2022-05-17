import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FatText } from "../shared";

const CommentContainer = styled.div`
  margin-top: 20px;
`;

const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
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
      <CommentCaption>
        {payload?.split(" ").map((word, i) =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={i}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={i}>{word} </React.Fragment>
          )
        )}
      </CommentCaption>
    </CommentContainer>
  );
};

export default CommentDetail;
