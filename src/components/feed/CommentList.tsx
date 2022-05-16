import styled from "styled-components";
import { Maybe, User } from "../../generated/graphql";
import CommentDetail from "./CommentDetail";

const CommentContainer = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-size: 12px;
`;

interface CommentListProps {
  comments?: {
    id: number;
    payload: string;
    isMine: boolean;
    createdAt: string;
    user: {
      username: string;
      avatar: string;
    };
  }[];
  commentNumber?: number | null;
  caption?: string | null;
  user?: Maybe<Maybe<User>>;
}

const CommentList = ({
  comments,
  commentNumber,
  caption,
  user,
}: CommentListProps) => {
  return (
    <CommentContainer>
      <CommentDetail user={user} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <CommentDetail key={comment.id} user={user} payload={comment.payload} />
      ))}
    </CommentContainer>
  );
};

export default CommentList;
