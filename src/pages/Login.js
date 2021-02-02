import { Form, Button } from "semantic-ui-react";
import { useState, useContext } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

import duffChat from "../assets/duffChat.png";

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    password: "",
  };

  const { onChange, onSubmit, values } = useForm(
    loginUserCallback,
    initialState
  );

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      context.login(result.data.login);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="loginForm">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <img style={{ width: "30%" }} src={duffChat} alt="duffChat Logo" />
        <Form.Input
          label="Username"
          placeholder="Enter Username..."
          name="username"
          type="text"
          error={errors.username ? true : false}
          value={values.username}
          onChange={onChange}
        />

        <Form.Input
          label="Password"
          placeholder="Enter Password..."
          name="password"
          error={errors.password ? true : false}
          value={values.password}
          type="password"
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
