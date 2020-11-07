import * as React from "react";
import IconButton from '@material-ui/core/IconButton';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

function Login() {

  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [anchorElLogin, setAnchorElLogin] = React.useState(null);
  const [loginOpen, setLoginOpen] = React.useState(false);

  // Event handlers

  const openLogin = (event) => {
    setLoginOpen(true);
    setAnchorElLogin(event.currentTarget);
  }

  const closeLogin = (event) => {
    setLoginOpen(false);
    setAnchorElLogin(null);
    setEmail("");
    setPassword("");
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const updateEmail = (event) => {
    setEmail(event.target.value);
  }

  const updatePassword = (event) => {
    setPassword(event.target.value);
  }

  const sendForm = (event) => {
    const data = {
      email: email,
      password: password,
    }
    alert(`sending following ${data.email}`);
    
  }
  
  //console.log(props);

  return (
    <div className="login">
      <IconButton 
        edge="start" 
        //className={styledClasses.editButton} 
        color="inherit" 
        onClick={openLogin}
      >
        <VpnKeyIcon />
      </IconButton>
      <Dialog 
        onClose={closeLogin} 
        open={loginOpen}
        anchorEl={anchorElLogin}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <DialogTitle id="simple-dialog-title">Login</DialogTitle>
          <TextField id="euros" label="email" value={email} onChange={updateEmail} />
          <FormControl >
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={updatePassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        <DialogActions>
          <Divider />
          <Button variant="contained" id={"dialogOK"} onClick={closeLogin}>Close</Button>
          <Button variant="contained" id={"dialogOK"} onClick={sendForm}>Login</Button>
        </DialogActions>
      
      </Dialog>
    </div>
  );

};
 
export default Login;