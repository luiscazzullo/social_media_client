import { useContext } from 'react';
import { Card, Icon, Label, Image, Button, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton';

const PostCard = ({ post }) => {
  const { body, createdAt, id, username, likeCount, commentCount, likes} = post;
  const { user } = useContext(AuthContext);
  const likePost = () => {
    console.log('Like')
  }
  const commentOnPost = () => {
    console.log('comment');
  }
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`} >{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton 
          post={{ id, likes, likeCount }}
          user={user}
        />
        <Popup 
          content="Comentarios en el post"
          inverted
          trigger={
            <Button as='div' labelPosition='right' as={Link} to={`/posts/${id}`}>
              <Button color='blue' basic>
                <Icon name='comments' />
              </Button>
              <Label basic color='blue' pointing='left'>
                {commentCount}
              </Label>
            </Button>
          }
        />
        {
          user && user.username === username && (
            <DeleteButton postId={id} />
          )
        }
      </Card.Content>
    </Card>
  )
}

export default PostCard;