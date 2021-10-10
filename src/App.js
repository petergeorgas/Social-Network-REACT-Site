import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import StartPage from "./components/StartPage";
import Home from "./components/Home";
import RegisterPage from "./components/RegisterPage";
import { useEffect, useState } from "react";
import authService from "./util/auth-service";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      console.log("User FOUND!!!");
    }
  }, []);

  const logOut = () => {
    authService.logout();
  };

  const updateCurrentUser = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      console.log("User found!");
    }
  };

  return (
    <div className="App">
      <div className="background"></div>
      <div className="centerBlockOuter">
        <div className="centerBlockInner">
          <BrowserRouter>
            <Route exact path="/login">
              <StartPage update={updateCurrentUser} />
            </Route>
            <Route exact path="/register" component={RegisterPage} />
            <PrivateRoute path="/home" component={Home} />
            {currentUser ? (
              <Redirect from="/" to="/home" />
            ) : (
              <Redirect from="/" to="/login" />
            )}
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
