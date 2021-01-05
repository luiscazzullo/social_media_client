import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm } from '../hooks/useForm';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY, CREATE_POST_MUTATION } from '../utils/graphql';

const PostForm = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const { values, onChange, onSubmit } = useForm(createPostCb, {
    body: ''
  })

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update: (proxy, result) => {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({ 
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts]
        }
      });
      values.body = '';
    },
    onError: (err) => setErrorMsg(err.graphQLErrors[0].message)
  });

  function createPostCb() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Crea un post:</h2>
        <Form.Field>
          <Form.Input 
            placeholder="Escribe un post"
            name="body"
            onChange={onChange}
            value={values.body}
            error={errorMsg ? true : false}
          />
          <Button type="submit" color="teal">
            Enviar
          </Button>
        </Form.Field>
      </Form>
      {
        errorMsg && (
          <div className="ui error message" style={{ marginBottom: 20 }}>
            <p>{errorMsg}</p>
          </div>
        )
      }
    </>
  );
}

 
export default PostForm;