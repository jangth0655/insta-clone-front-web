import styled from "styled-components";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import { FatLink } from "../components/shared";
import PageTitle from "../components/pageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { MutationResponse } from "../generated/graphql";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  text-align: center;
  font-size: 16px;
  margin-top: 10px;
`;

interface SignUpForm {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  result?: string;
}

const CREATE_MUTATION = gql`
  mutation createAccount(
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $username: String!
  ) {
    createAccount(
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      username: $username
    ) {
      ok
      error
    }
  }
`;

const SignUp = () => {
  //const [username, setUsername] = useState<string | undefined>("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<SignUpForm>({
    mode: "onChange",
  });

  const onCompleted = (data: any) => {
    const username = getValues("username");
    const {
      createAccount: { ok },
    } = data;
    if (!ok) {
      return;
    }
    navigate(routes.home, {
      state: {
        username,
        message: "Account created. Please log in.",
      },
    });
  };

  const [createAccount, { data, loading }] = useMutation<MutationResponse>(
    CREATE_MUTATION,
    { onCompleted }
  );

  const onSubmitValid = (formValid: SignUpForm) => {
    const { username } = formValid;
    if (loading) return;
    createAccount({
      variables: { ...formValid },
    });
    navigate(routes.home, { state: { username } });
  };

  return (
    <AuthLayout>
      <PageTitle title="Sign Up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName", { required: "First Name is required" })}
            placeholder="First Name"
            type="text"
          />
          <Input
            {...register("lastName", { required: "Last Name is required" })}
            placeholder="Last Name"
            type="text"
          />
          <Input
            {...register("name", { required: "is required" })}
            placeholder="Name"
            type="text"
          />
          <Input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            type="text"
          />
          <Input
            {...register("username", { required: "Username is required" })}
            placeholder="Username"
            type="text"
          />
          <Input
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            type="password"
          />
          <Button type="submit" disabled={!isValid || loading}>
            Sign Up
          </Button>
          <FormError message={errors?.result?.message} />
        </form>
      </FormBox>
      <BottomBox link={routes.home} linkText="Log In" ctx="Have an account?" />
    </AuthLayout>
  );
};

export default SignUp;
