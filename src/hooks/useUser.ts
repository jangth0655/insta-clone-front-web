import { logUserOut } from "./../apollo";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar } from "../apollo";
import { Query } from "../generated/graphql";

export const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
      totalFollowing
      totalFollowers
    }
  }
`;

export interface IUser {
  me: {
    id: number;
    username: string;
    avatar: string;
    totalFollowing: number;
    totalFollowers: number;
  };
}

const useUser = () => {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data, error } = useQuery<IUser>(ME_QUERY, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return { data, loading: !data && !error };
};

export default useUser;
