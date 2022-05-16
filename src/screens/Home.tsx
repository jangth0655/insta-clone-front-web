import { gql, useQuery } from "@apollo/client";
import { Query } from "../generated/graphql";
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

const Home = () => {
  const { data } = useQuery<Query>(FEED_QUERY);
  //const navigation = useNavigate();
  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed &&
        data?.seeFeed?.map((photo) => (
          <PhotoItem comments={photo?.comments} key={photo?.id} {...photo} />
        ))}
    </div>
  );
};

export default Home;
