import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={1} style={{ width: "50%", marginLeft: "25%" }}>
      <Grid.Row>
        {user && (
          <Grid.Column className="postForm">
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          <Transition.Group>
            {data &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginTop: "25px" }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}
