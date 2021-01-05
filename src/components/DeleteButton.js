import { useState } from 'react';
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_POST_MUTATION, FETCH_POSTS_QUERY, DELETE_COMMENT_MUTATION } from '../utils/graphql';

const DeleteButton = ({ postId, callback, commentId }) => {
  const[open, setOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  
  const [deletePostOrMutation] = useMutation(mutation, {
    update: (proxy, result) => {
      setOpen(false);
      if(!commentId) {
        //Remove post from cache
        const { getPosts } = proxy.readQuery({ query: FETCH_POSTS_QUERY });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: getPosts.filter(p => p.id !== postId)
          }
        })
      }
      if(callback) {
        callback();
      }
    },
    variables: {
      postId,
      commentId
    }
  })
  return (
    <>
      <Popup 
        content={commentId ? "Borrar el comentario" : "Borrar el post"}
        inverted
        trigger={
          <Button
            floated="right"
            as="div"
            color="red"
            onClick={() => setOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm 
        open={open} 
        onCancel={() => setOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}
 
export default DeleteButton;