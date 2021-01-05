import { useContext, useState } from 'react';
import { FETCH_POST_QUERY, SUBMIT_COMMENT_MUTATION } from '../utils/graphql';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Image, Card, Button, Icon, Label, Form } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const SinglePost = ({ match, history }) => {
  const postId = match.params.postId;

  const { user } = useContext(AuthContext);
  
  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  })

  const [comment, setComment] = useState('');

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update: (proxy, result) => {
      setComment('')
    },
    variables: {
      postId,
      body: comment
    }
  })

  function deletePostCb() {
    history.push('/')
  }

  let postMarkup;
  if(!data?.getPost) {
    postMarkup = <p>Loading post...</p>
  } else {
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size="small"
              floated="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button as="div" labelPosition="right" onClick={() => console.log('Comment on post')}>
                  <Button basic colo="blue">
                    <Icon name="comments" />
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </Button>
                { user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCb} />
                )}
              </Card.Content>
            </Card>
            {
              user && (
                <Card fluid>
                  <Card.Content>
                    <p>Añade un comentario</p>
                    <Form>
                      <div className="ui action input fluid">
                        <input
                          type="text"
                          placeholder="Comentario..."
                          name="comment"
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="ui button teal"
                          disabled={comment.trim() === ''}
                          onClick={submitComment}>
                          Submit
                      </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )
            }
            {
              comments.map(comment => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>
                      {comment.body}
                    </Card.Description>
                  </Card.Content>
                </Card>
              ))
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup;
}
 
export default SinglePost;