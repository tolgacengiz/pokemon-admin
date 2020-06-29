import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import './App.css';


const AuthorizedContainer = (props) => {
  const token = localStorage.getItem('token');

  const [authResult, updateAuthResult] = useState({ token });
  const [formLogin, changeFormLoginValue] = useState('');
  const [formPassword, changeFormPasswordValue] = useState('');
  const [fetching, setFetching] = useState(false);

  const [fetchError, setFetchError] = useState(null);

  const onLoginChange = (event) => {
    changeFormLoginValue(event.target.value);
  }

  const onPasswordChange = (event) => {
    changeFormPasswordValue(event.target.value);
  }

  const onLoginFormSubmit = () => {
    setFetching(true);

    fetch('http://localhost:8080/login', {
      method: 'POST',
      body: JSON.stringify({
        username: formLogin,
        password: formPassword
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(authResponse => {
        // authResponse - { error, token }

        if (authResponse.error) {
          setFetchError(authResponse.error);
        } else {
          const { token } = authResponse;
          localStorage.setItem('token', token);
          updateAuthResult({ token });
        }

        setFetching(false);
      })
      .catch(err => {
        console.log(err.message)
      })
      ;
  };

  if (authResult.token) {
    const encodedTokenPayload = authResult.token.split('.')[0];
    const decodedTokenPayload = atob(encodedTokenPayload);
    const userData = JSON.parse(decodedTokenPayload);

    return (
      <div>
        username: {userData.username}
        <br />
        firstName: {userData.firstName}
        <br />
        lastName: {userData.lastName}
        <br />

        <div>
          {props.children}
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" style={{ padding: 20, textAlign: 'center' }}>
        <TextField
          value={formLogin}
          label="User Name"
          onChange={onLoginChange}
          disabled={fetching}
        />

        <br />
        <br />

        <TextField
          value={formPassword}
          type="password"
          label="Password"
          onChange={onPasswordChange}
          disabled={fetching}
        />

        <br />
        <br />
        <br />

        <Button
          onClick={onLoginFormSubmit}
          disabled={fetching}
        >
          Log in
        </Button>
      </Container>
    </React.Fragment>
  );
};

const App = () => {
  return (
    <div className="App">
      <AuthorizedContainer>
        You are logged in!
      </AuthorizedContainer>
    </div>
  );
}

export default App;