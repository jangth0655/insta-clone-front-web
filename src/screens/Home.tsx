import { gql, useQuery } from "@apollo/client";
//import { useNavigate } from "react-router-dom";
//import { logUserOut } from "../apollo";
import PhotoItem from "../components/feed/PhotoItem";
import PageTitle from "../components/pageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragment";

const FEED_QUERY = gql`
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
`;

interface IUser {
  username: string;
  avatar: string;
}

interface ICommentWithUser {
  comments: {
    id: number;
    payload: string;
    isMine: boolean;
    createdAt: number;
    user: IUser;
  };
}

interface QueryItem {
  seeFeed: {
    id: string;
    user: IUser;
    file: string;
    caption: string;
    likes: number;
    comments: ICommentWithUser;
    commentNumber: number;
    createdAt: number;
    isMine: boolean;
    isLiked: boolean;
  }[];
}

const Home = () => {
  const { data } = useQuery<QueryItem>(FEED_QUERY);
  //const navigation = useNavigate();
  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed &&
        data?.seeFeed?.map((photo: any) => (
          <PhotoItem comments={photo?.comments} key={photo?.id} {...photo} />
        ))}
    </div>
  );
};

export default Home;
