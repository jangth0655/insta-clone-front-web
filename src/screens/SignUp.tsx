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

const SignUp = () => {
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
        <form>
          <Input placeholder="Name" type="text" />
          <Input placeholder="Email" type="text" />
          <Input placeholder="Username" type="text" />
          <Input placeholder="Password" type="password" />
          <Button type="submit">Sign Up</Button>
        </form>
      </FormBox>
      <BottomBox link={routes.home} linkText="Log In" ctx="Have an account?" />
    </AuthLayout>
  );
};

export default SignUp;
