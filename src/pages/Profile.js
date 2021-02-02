import { useContext } from "react";
import { AuthContext } from "../context/auth";
import moment from "moment";

import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";

import { FETCH_POSTS_QUERY } from "../util/graphql";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  let first = user.username.split("")[0];
  let avatarImg = `https://ui-avatars.com/api/?name=${first}`;

  function displayPosts(post) {
    if (post.username === user.username)
      return (
        <Grid.Column key={post.id} style={{ marginTop: "25px" }}>
          <PostCard post={post} />
        </Grid.Column>
      );
    else return "";
  }

  return (
    <>
      <Grid columns={2} style={{ width: "80%", marginLeft: "10%" }}>
        <Grid.Column>
          <div class="ui card">
            <div class="image">
              <img alt="Display Pic" src={avatarImg} />
            </div>
            <div class="content">
              <div class="header">{user.username}</div>
              <div class="meta">
                <span class="date">
                  Joined {moment(user.createdAt).format("LLL")}
                </span>
              </div>
            </div>
            <div class="extra content">
              <div>
                <i class="user icon"></i>
                {user.email}
              </div>
            </div>
          </div>
        </Grid.Column>
        <Grid.Column className="myPosts">
          {loading ? (
            <h1>Loading posts...</h1>
          ) : (
            <Transition.Group>
              {data && data.getPosts.map((post) => displayPosts(post))}
            </Transition.Group>
          )}
        </Grid.Column>
      </Grid>
    </>
  );
}
