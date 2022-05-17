import { ApolloCache, gql, useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FatText } from "../shared";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

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
  id?: number;
  user?: {
    username?: string | null;
    avatar?: string | null;
  } | null;
  payload?: string | null;
  isMine?: boolean;
  photoId?: number | null;
}

interface DeleteCommentMutation {
  ok: boolean;
  error?: string;
}

const CommentDetail = ({
  user,
  payload,
  id,
  isMine,
  photoId,
}: CommentDetailProps) => {
  const updateDeleteComment = (cache: ApolloCache<any>, result: any) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({
        id: `Comment:${id}`,
      });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber: (prev) => prev - 1,
        },
      });
    }
  };
  const [deleteCommentMutation] = useMutation<DeleteCommentMutation>(
    DELETE_COMMENT_MUTATION,
    {
      variables: {
        id,
      },
      update: updateDeleteComment,
    }
  );
  const onDeleteClick = () => {
    deleteCommentMutation();
  };
  return (
    <CommentContainer>
      <Link to={`/users/${user?.username}`}>
        <FatText>{user?.username}</FatText>
      </Link>
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
      {isMine ? <button onClick={onDeleteClick}>❌</button> : null}
    </CommentContainer>
  );
};

export default CommentDetail;
