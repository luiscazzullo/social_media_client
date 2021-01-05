import { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/auth';

const INITIAL_STATE = {
  username: '',
  password: ''
}

const Login = ({ history }) => {
  const { login } = useContext(AuthContext)
  const [errors, setErrors] = useState('');
  const { onChange, onSubmit, values } = useForm(logUser, INITIAL_STATE);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      login(result.data.login)
      history.push('/');
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0])
      setErrors(err.graphQLErrors[0].message)
    },
    variables: values
  })

  function logUser() {
    loginUser();
  }
  
  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmit}
        noValidate
        className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          type="text"
          label="Nombre de usuario"
          placeholder="Nombre de usuario..."
          name="username"
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          type="password"
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {
        errors &&
        (
          <div className="ui error message">
            <p>{errors}</p>
          </div>
        )
      }
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login (
      username: $username
      password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Login;