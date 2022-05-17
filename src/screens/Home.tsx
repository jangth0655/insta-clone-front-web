import { gql, useQuery } from "@apollo/client";
//import { useNavigate } from "react-router-dom";
//import { logUserOut } from "../apollo";
import PhotoItem from "../components/feed/PhotoItem";
import PageTitle from "../components/pageTitle";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      user {
        username
        avatar
      }
      file
      caption
      likes
      comments {
        id
        payload
        isMine
        createdAt
        user {
          username
          avatar
        }
      }
      commentNumber
      createdAt
      isMine
      isLiked
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
