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
  comments?: Maybe<Maybe<Comment>[]>;
}

interface toggleLikeMutation {
  toggleLike: {
    ok: boolean;
    error?: string;
  };
}

type CacheData = {
  isLiked: boolean;
  likes: number;
};

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
      const fragmentId = `Photo:${id}`;
      const fragment = gql`
        fragment BSName on Photo {
          isLiked
          likes
        }
      `;
      const cacheData = cache.readFragment<CacheData>({
        id: fragmentId,
        fragment,
      });

      if (cacheData && "isLiked" in cacheData && "likes" in cacheData) {
        const { isLiked: cacheIsLiked, likes: cacheLikes } = cacheData;
        cache.writeFragment<CacheData>({
          id: fragmentId,
          fragment,
          data: {
            isLiked: !cacheIsLiked,
            likes: cacheIsLiked ? cacheLikes - 1 : cacheLikes + 1,
          },
        });
      }
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
        <Avatar lg url={user?.avatar} />
        <Username>{user?.username}</Username>
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
          commentNumber={commentNumber}
          caption={caption}
          user={user}
        />
      </PhotoData>
    </PhotoContainer>
  );
};

export default PhotoItem;
