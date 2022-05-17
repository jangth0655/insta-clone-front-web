import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import Layout from "./components/layout";

import routes from "./routes";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFoundpage from "./screens/NotFoundpage";
import Profile from "./screens/Profile";
import SignUp from "./screens/SignUp";
import { GlobalStyles } from "./styles";
import { darkTheme, lightTheme } from "./theme";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Routes>
              <Route path="*" element={<NotFoundpage />} />
              <Route
                path={routes.home}
                element={
                  isLoggedIn ? (
                    <Layout>
                      <Home />
                    </Layout>
                  ) : (
                    <Login />
                  )
                }
              />
              {!isLoggedIn ? (
                <Route path={routes.signUp} element={<SignUp />} />
              ) : null}
              <Route path={`/users/:username`} element={<Profile />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
