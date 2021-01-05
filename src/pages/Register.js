import { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/auth';

const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const Register = ({ history }) => {
  const [errors, setErrors] = useState('');
  const { onChange, onSubmit, values } = useForm(registerUser, INITIAL_STATE);
  const { login } = useContext(AuthContext);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      login(result.data.register);
      history.push('/');
    },
    onError: (err) => setErrors(err.graphQLErrors[0].message),
    variables: values
  })

  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form 
        onSubmit={onSubmit} 
        noValidate 
        className={loading ? 'loading': ''}>
        <h1>Registro</h1>
        <Form.Input
          type="text"
          label="Nombre de usuario"
          placeholder="Nombre de usuario..."
          name="username"
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          type="email"
          label="Email"
          placeholder="Email..."
          name="email"
          value={values.email}
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
        <Form.Input
          type="password"
          label="Repetir contraseña"
          placeholder="Repita su contraseña"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Registro
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register (
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }) {
      id
      email
      username
      createdAt
      token
    }
  }
`
 
export default Register;