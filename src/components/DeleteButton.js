import { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Confirm } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";

export default function DeleteButton({ postId, commentId, callback }) {
  const [confirmModal, setConfirmModal] = useState(false);

  const ourMutation = commentId ? DELETE_COMMENT : DELETE_POST;

  const [deleteMutation] = useMutation(ourMutation, {
    update(proxy) {
      setConfirmModal(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        let newData;
        newData = {
          getPosts: data.getPosts.filter((p) => p.id !== postId),
        };
        console.log(data, newData);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
      }
      if (callback) {
        callback();
      }
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <Button
        negative
        circular
        icon="trash"
        style={{ float: "right", marginTop: "10px" }}
        onClick={() => setConfirmModal(true)}
        floated="right"
      ></Button>
      <Confirm
        open={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={deleteMutation}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
