import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import './App.css';

const fakeFetch = (endpointUrl, dataPayload /* { username, password } */) => {
  console.log('Fetch url', endpointUrl);
  console.log('Fetch payload', dataPayload.body);

  const etalonValues = {
    username: 'admin',
    password: '12345'
  };

  const testUser = {
    firstName: 'Tolga',
    lastName: 'Cengiz'
  };

  const promise = new Promise((res, rej) => {
    setTimeout(() => {
      const user = JSON.parse(dataPayload.body);

      if (etalonValues.password === user.password && etalonValues.username === user.username) {
        res(testUser);
      } else {
        res(null);
      }
    }, 3000);
  });

  return promise;
};

const AuthorizedContainer = (props) => {
  let storedUser = localStorage.getItem('user');
  const [user, changeUser] = useState(null);
  const [formLogin, changeFormLoginValue] = useState('');
  const [formPassword, changeFormPasswordValue] = useState('');
  const [fetching, setFetching] = useState(false);

  const onLoginChange = (event) => {
    changeFormLoginValue(event.target.value);
  }

  const onPasswordChange = (event) => {
    changeFormPasswordValue(event.target.value);
  }

  const onLoginFormSubmit = () => {
    setFetching(true);
    fakeFetch('http://mybackend.com/login', {
      method: 'POST',
      body: JSON.stringify({
        username: formLogin,
        password: formPassword
      }),
    }).then(user => {
      if (user) {
        const userAsString = JSON.stringify(user);
        localStorage.setItem('user', userAsString);

        changeUser(user);
      } else {
        changeUser(null);
      }
    });
  };

  if (user) {
    return <div>{props.children}</div>
  }


  return (
    <div className="app-container">
      <React.Fragment>
        <CssBaseline />
        <h2>Login</h2>
        <Container maxWidth="sm" style={{ padding: 20, textAlign: 'center' }}>



          <TextField
            value={formLogin}
            label="User Name"
            onChange={onLoginChange}
            disabled={fetching}
            variant="outlined"
          />

          <br />
          <br />


          <TextField
            value={formPassword}
            type="password"
            label="Password"
            onChange={onPasswordChange}
            disabled={fetching}
            variant="outlined"
          />






          <br />
          <br />
          <br />
          {/* <FormControlLabel
          control={
            <Checkbox
              checked={state.checkedB}
              onChange={handleChange}
              name="checkedB"
              color="primary"
            />
          }
          label="Primary"
        />
        <Checkbox

          name="checkedB"
          color="primary"
          label="Remember me"
        />
        <br />
        <br />
 */}
          <Button
            variant="contained"
            color="primary"
            onClick={onLoginFormSubmit}
            disabled={fetching}
          >
            Log in
        </Button>
        </Container>
      </React.Fragment>
    </div>
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