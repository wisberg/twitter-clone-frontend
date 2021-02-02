import { BrowserRouter as Router, Route } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import SinglePost from "./pages/SinglePost";
import Profile from "./pages/Profile";

function App() {
  //My authroute below is backwards, it authenticates if someone isnt logged in
  return (
    <AuthProvider>
      <Router>
        <div className="ui container">
          <NavBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
