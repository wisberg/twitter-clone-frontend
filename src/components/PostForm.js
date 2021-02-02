import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  function createPostCallback() {
    createPost();
  }

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
    onError(error) {
      console.log(error);
    },
  });
  if (error) {
    console.log(error);
  }

  return (
    <>
      <Form onSubmit={onSubmit} style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "black" }}>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Create a post..."
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal" style={{ marginBottom: "15px" }}>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: "20px" }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;
