import { useState, useEffect } from 'react';
import { Button, Label, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import{ useMutation } from '@apollo/react-hooks';
import { LIKE_POST_MUTATION } from '../utils/graphql'

const LikeButton = ({ post: { id, likeCount, likes }, user}) => {
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id}
  })
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if(user && likes.find(like => like.username === user.username)){
      setLiked(true)
    } else {
      setLiked(false);
    }
  }, [user, likes])

  const likedButton = user ? (
    liked ? (
    <Button color='teal'>
      <Icon name='heart' />
    </Button>
    ) : (
    <Button color='teal' basic>
      <Icon name='heart' />
    </Button>
    )
  ) : (
    <Button as={Link} to="/login" color='teal' basic>
      <Icon name='heart' />
    </Button>
  )

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      <Popup
        content={liked ? 'Ya no me gusta': 'Me gusta'}
        inverted
        trigger={likedButton}
      />
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  );
}
 
export default LikeButton;