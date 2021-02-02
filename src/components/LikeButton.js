import { useState, useEffect } from "react";
import { Icon, Label, Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

export default function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="green" onClick={likePost}>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="green" basic onClick={likePost}>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="green" basic as={Link} to="/login">
      <Icon name="heart" />
    </Button>
  );

  return (
    <div className="ui two buttons">
      <Button as="div" labelPosition="right" style={{ marginRight: "5px" }}>
        {likeButton}
        <Popup
          trigger={
            <Label basic color="green" pointing="left">
              {likeCount}
            </Label>
          }
        >
          {likeCount !== 0 ? (
            likes.map((like) => {
              return (
                <Popup.Content key={like.username}>
                  {like.username}
                </Popup.Content>
              );
            })
          ) : (
            <Popup.Content>No likes yet</Popup.Content>
          )}
        </Popup>
      </Button>
    </div>
  );
}

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
