import { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import {
  Button,
  Card,
  Grid,
  Image,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

import { AuthContext } from "../context/auth";

export default function SinglePost(props) {
  const [comment, setComment] = useState("");

  const postId = props.match.params.postId; //getting postId from the url params
  const { user } = useContext(AuthContext);

  const commentRef = useRef(null);

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    update() {
      setComment("");
      commentRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deleteButtonCallback() {
    props.history.push("/");
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    let first = username.split("")[0];
    let avatarImg = `https://ui-avatars.com/api/?name=${first}`;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="medium"
              src={avatarImg}
              style={{ borderRadius: "50%" }}
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  <h1>{username}</h1>
                </Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
                <hr />
                <Card.Content extra>
                  <div className="ui two buttons">
                    <LikeButton user={user} post={{ id, likeCount, likes }} />
                    <Button as="div" labelPosition="right">
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  </div>
                </Card.Content>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deleteButtonCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={createComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((com) => (
              <Card fluid key={com.id}>
                <Card.Content>
                  {user && user.username === com.username && (
                    <DeleteButton postId={id} commentId={com.id} />
                  )}
                  <Card.Header>{com.username}</Card.Header>
                  <Card.Meta>{moment(com.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{com.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;
