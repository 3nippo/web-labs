import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles( (theme) => ({
  margined: {
    margin: 30
  },

  inpLabel: {
    margin: 15
  }
}))

function App() 
{
  const classes = useStyles()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const [succeeded, setSucceeded] = useState(false)

  const onSubmit = () =>
  {
    let failed = false;

    if (username != "admin")
    {
      setUsernameError(true)
      failed = true;
    }
    else
    {
      setUsernameError(false)
    }
      
    if (password != "admin")
    {
      setPasswordError(true)
      failed = true;
    }
    else
    {
      setPasswordError(false)
    }

    setSucceeded(!failed)
  }

  return (
    <div>
      <Grid
        className={ classes.margined }
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >

        <TextField
          value={username}
          label="Username"
          placeholder="Enter username"
          onChange={ e => setUsername(e.target.value) }
          required
          error={usernameError}
          sx={{
            margin: 2
          }}
        />

        <TextField
          value={password}
          className={ classes.inpLabel }
          label="Password"
          placeholder="Enter password"
          onChange={ e => setPassword(e.target.value) }
          required
          error={passwordError}
          type="password"
          sx={{
            margin: 2
          }}
        />

        <Button 
          variant="contained"
          onClick={ () => onSubmit() }
          sx={{
            margin: 2
          }}
        >
          Login
        </Button>
      </Grid>

      <Snackbar
        open={usernameError && !passwordError}
      >
        <Alert severity="error">
          Login is not "admin"!
        </Alert>
      </Snackbar>

      <Snackbar
        open={passwordError && !usernameError}
      >
        <Alert severity="error">
          Password is not "admin"!
        </Alert>
      </Snackbar>

      <Snackbar
        open={passwordError && usernameError}
      >
        <Alert severity="error">
          Both username and password are not "admin"!
        </Alert>
      </Snackbar>

      <Snackbar
        open={succeeded}
      >
        <Alert severity="success">
          You've successfully entered credentials!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
