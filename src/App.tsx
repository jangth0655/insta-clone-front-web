import { useReactiveVar } from "@apollo/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { darkModeVar, isLoggedInVar } from "./apollo";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFoundpage from "./screens/NotFoundpage";
import { GlobalStyles } from "./styles";
import { darkTheme, lightTheme } from "./theme";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="*" element={<NotFoundpage />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
