import { ApolloCache, gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Maybe, MutationResponse, User } from "../../generated/graphql";
import useUser from "../../hooks/useUser";
import CommentDetail from "./CommentDetail";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

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
  photoId?: number | null;
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

interface CommentForm {
  payload: string;
}

const CommentList = ({
  comments,
  commentNumber,
  caption,
  user,
  photoId,
}: CommentListProps) => {
  const { data: userData } = useUser();
  const { register, handleSubmit, reset, getValues } = useForm<CommentForm>();
  const createCommentUpdate = (cache: ApolloCache<any>, result: any) => {
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    if (ok && userData) {
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload: getValues("payload"),
        user: {
          ...userData,
        },
      };
      reset();
      const newCacheComment = cache.writeFragment({
        fragment: gql`
          fragment BSName on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
        data: newComment,
      });

      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments: (prev) => {
            return [...prev, newCacheComment];
          },
          commentNumber: (prev) => {
            return prev + 1;
          },
        },
      });
    }
  };
  const [createCommentMutation, { loading }] = useMutation<MutationResponse>(
    CREATE_COMMENT_MUTATION,
    {
      update: createCommentUpdate,
    }
  );

  const onValid = ({ payload }: CommentForm) => {
    if (loading) return;
    createCommentMutation({
      variables: {
        photoId,
        payload,
      },
    });
  };

  return (
    <CommentContainer>
      <CommentDetail user={user} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>

      {comments?.map((comment) => (
        <CommentDetail
          key={comment.id}
          user={user}
          payload={comment.payload}
          id={comment.id}
          isMine={comment.isMine}
          photoId={photoId}
        />
      ))}

      <div>
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("payload", { required: true })}
            type="text"
            placeholder="Write a comment..."
          />
        </form>
      </div>
    </CommentContainer>
  );
};

export default CommentList;
