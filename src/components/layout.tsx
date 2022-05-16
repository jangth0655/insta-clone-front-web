import React from "react";
import styled from "styled-components";
import Header from "./Header";

const Content = styled.main`
  margin: 0 auto;
  max-width: 58rem;
  min-height: 100vh;
  margin-top: 2.8rem;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Content>{children}</Content>
    </>
  );
};

export default Layout;
