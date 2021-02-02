import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/auth";

import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

export default function PostCard(props) {
  const {
    body,
    createdAt,
    id,
    username,
    likeCount,
    commentCount,
    likes,
  } = props.post;

  const { user } = useContext(AuthContext);
  let first = username.split("")[0];
  let avatarImg = `https://ui-avatars.com/api/?name=${first}`;

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="tiny"
          src={avatarImg}
          style={{ borderRadius: "50%" }}
        />
        <Card.Header>
          <h2>{username}</h2>
        </Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description as={Link} to={`/posts/${id}`}>
          <p style={{ fontSize: "1.3rem" }}>{body}</p>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <LikeButton user={user} post={{ id, likes, likeCount }} />
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </div>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}
