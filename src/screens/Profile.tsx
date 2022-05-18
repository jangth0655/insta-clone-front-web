import {
  ApolloCache,
  gql,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import { useParams } from "react-router-dom";
import { PHOTO_FRAGMENT } from "../fragment";
import { Maybe, Query, User } from "../generated/graphql";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { FatText } from "../components/shared";
import Button from "../components/auth/Button";
import PageTitle from "../components/pageTitle";
import useUser, { ME_QUERY } from "../hooks/useUser";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
    }
  }
`;

const Container = styled.div`
  min-height: 100vh;
  max-width: 935px;
  margin: auto;
  padding: 10px 0;
`;

const Header = styled.div`
  display: flex;
`;
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;

const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div<{ bg?: string }>`
  max-width: 100%;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ProfileBtn = styled(Button).attrs({ as: "span" })`
  border-radius: 10px;
  margin-left: 10px;
  cursor: pointer;
`;

const SEE_PROFILE_QUERY = gql`
  ${PHOTO_FRAGMENT}
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      avatar
      email
      firstName
      isFollowing
      isMe
      lastName
      photos {
        ...PhotoFragment
      }
      totalFollowers
      totalFollowing
      username
    }
  }
`;

interface FollowMutation {
  [key: string]: {
    ok: boolean;
    error?: string;
  };
}

const Profile = () => {
  const { username } = useParams();
  const { data: userData } = useUser();
  const loggedInUsername = userData?.me?.username;
  const client = useApolloClient();
  const { data, loading } = useQuery<Query>(SEE_PROFILE_QUERY, {
    variables: {
      username,
    },
  });

  const unfollowUserUpdate = (cache: ApolloCache<any>, result: any) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing: (prev) => false,
        totalFollowers: (prev) => prev - 1,
      },
    });
    cache.modify({
      id: `User:${loggedInUsername}`,
      fields: {
        totalFollowing: (prev) => prev - 1,
      },
    });
  };

  const [unfollowUser] = useMutation<FollowMutation>(UNFOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: unfollowUserUpdate,

    /*  refetchQueries: [
      { query: SEE_PROFILE_QUERY, variables: { username } },
      {
        query: ME_QUERY,
      },
    ], */
  });

  const followUserCompleted = (data: any) => {
    const { cache } = client;
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing: (prev) => true,
        totalFollowers: (prev) => prev + 1,
      },
    });
    cache.modify({
      id: `User:${loggedInUsername}`,
      fields: {
        totalFollowing: (prev) => prev + 1,
      },
    });
  };

  const [followUser] = useMutation<FollowMutation>(FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    onCompleted: followUserCompleted,
    /* refetchQueries: [
      { query: SEE_PROFILE_QUERY, variables: { username } },
      {
        query: ME_QUERY,
      },
    ], */
  });

  const getButton = (seeProfile: Maybe<User>) => {
    if (seeProfile) {
      const { isMe, isFollowing } = seeProfile;
      if (isMe) {
        return <ProfileBtn>Edit Profile</ProfileBtn>;
      }
      if (isFollowing) {
        return <ProfileBtn onClick={() => unfollowUser()}>Unfollow</ProfileBtn>;
      } else {
        return <ProfileBtn onClick={() => followUser()}>Follow</ProfileBtn>;
      }
    }
  };

  return (
    <Container>
      <PageTitle title={loading ? "Loading" : "Profile"} />
      <Header>
        <Avatar
          src={data?.seeProfile?.avatar ? data?.seeProfile?.avatar : ""}
        />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.username}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos &&
          data?.seeProfile?.photos.map((photo) => (
            <Photo key={photo?.id} bg={photo?.file}>
              <Icons>
                <Icon>
                  <FontAwesomeIcon icon={faHeart} />
                  {photo?.likes}
                </Icon>
                <Icon>
                  <FontAwesomeIcon icon={faComment} />
                  {photo?.commentNumber}
                </Icon>
              </Icons>
            </Photo>
          ))}
      </Grid>
    </Container>
  );
};

export default Profile;
