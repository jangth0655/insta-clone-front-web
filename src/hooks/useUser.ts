import { logUserOut } from "./../apollo";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar } from "../apollo";
import { Query } from "../generated/graphql";

const ME_QUERY = gql`
  query me {
    me {
      username
      avatar
    }
  }
`;

const useUser = () => {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data, error } = useQuery<Query>(ME_QUERY, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return;
};

export default useUser;
