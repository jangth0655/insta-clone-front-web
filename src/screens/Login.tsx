import styled from "styled-components";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Seperator from "../components/auth/Seperator";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import PageTitle from "../components/pageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { LoginResult } from "../generated/graphql";
import { logUserIn, TOKEN } from "../apollo";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Notification = styled.div`
  margin-top: 10px;
  color: #2ecc71;
`;

interface LoginForm {
  username: string;
  password: string;
  result: any;
}

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

interface LoginState {
  username?: string;
  message?: string;
}

const Login = () => {
  const location = useLocation();
  const state = location.state as LoginState | null;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: {
      username: state?.username || "",
    },
  });

  useEffect(() => {}, []);

  const onCompleted = (data: any) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      setError("result", { message: error });
    }
    if (token) {
      logUserIn(token);
    }
  };

  const [login, { loading }] = useMutation<LoginResult>(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmitValid = (data: LoginForm) => {
    if (loading) return;
    const { username, password } = data;
    login({
      variables: {
        username,
        password,
      },
    });
  };

  const clearLoginError = () => {
    clearErrors("result");
  };

  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification>{state?.message}</Notification>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: true,
              pattern: {
                message: "한글, 특문를 제외한 영문만 사용 가능하도록 패턴 설정",
                value: /^[a-z0-9]{1,15}$/g,
              },
              onChange: () => clearErrors,
            })}
            placeholder="Username"
            type="text"
            hasError={errors?.username ? true : false}
          />
          <FormError message={errors?.username?.message} />
          <Input
            {...register("password", {
              required: true,
              onChange: () => clearLoginError,
            })}
            placeholder="Password"
            type="password"
            hasError={errors?.password ? true : false}
          />
          <FormError message={errors?.password?.message} />
          <Button type="submit" value="Log in" disabled={!isValid || loading}>
            {loading ? "Loading" : "Log in"}
          </Button>
          <FormError message={errors?.result?.message} />
        </form>
        <Seperator />

        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        link={routes.signUp}
        linkText="Sign Up"
        ctx="Don't have an account?"
      />
    </AuthLayout>
  );
};

export default Login;
