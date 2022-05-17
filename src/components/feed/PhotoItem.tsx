import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { ApolloCache, gql, useMutation } from "@apollo/client";
import { Comment, Maybe, User } from "../../generated/graphql";
import CommentList from "./CommentList";
import { Link } from "react-router-dom";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  padding: 15px 20px;
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  max-width: 615px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const PhotoHeader = styled.div`
  padding: 5px 10px;
  display: flex;
  align-items: center;
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  width: 100%;
`;

const PhotoData = styled.div`
  padding: 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin-top: 10px;
  display: block;
`;

interface PhotoProps {
  id?: number | null;
  user?: Maybe<Maybe<User>>;
  isLiked?: boolean | null;
  likes?: number | null;
  file?: string | null;
  caption?: string | null;
  commentNumber?: number | null;
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
}

interface toggleLikeMutation {
  toggleLike: {
    ok: boolean;
    error?: string;
  };
}

const PhotoItem = ({
  id,
  isLiked,
  user,
  likes,
  file,
  caption,
  commentNumber,
  comments,
}: PhotoProps) => {
  const updateToggleLike = (cache: ApolloCache<any>, result: any) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;

    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked: (prev) => {
            return !prev;
          },
          likes: (prev) => {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikMutation] = useMutation<toggleLikeMutation>(
    TOGGLE_LIKE_MUTATION,
    {
      variables: {
        id,
      },
      update: updateToggleLike,
    }
  );

  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Link to={`/users/${user?.username}`}>
          <Avatar lg url={user?.avatar} />
        </Link>

        <Link to={`/users/${user?.username}`}>
          <Username>{user?.username}</Username>
        </Link>
      </PhotoHeader>
      {file ? <PhotoFile src={file} /> : null}
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={() => toggleLikMutation()}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                size="2x"
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon size="2x" icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon size="2x" icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        <CommentList
          {...comments}
          comments={comments}
          commentNumber={commentNumber}
          caption={caption}
          user={user}
          photoId={id}
        />
      </PhotoData>
    </PhotoContainer>
  );
};

export default PhotoItem;
