import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Login from './Login';
import Logout from './Logout';

function MobileMenu(props) {
  // Hooks
	const [anchorElMenu, setAnchorElMenu] = React.useState(null); 
	const menuOpen = Boolean(anchorElMenu);
    

  // Event handlers
	const handleMenu = event => {
		setAnchorElMenu(event.currentTarget);
	};
    
	const handleMenuClose = () => {
		setAnchorElMenu(null);
	};

	return (
		<div className="mobilemenu">
			<IconButton 
				//edge="start" 
				color="inherit" 
				onClick={handleMenu}
			>
				<Typography>"NIMI"</Typography>
				<AccountCircleIcon />
			</IconButton>
			<Menu
				id="help-appbar"
				anchorEl={anchorElMenu}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={menuOpen}
				onClose={handleMenuClose}
			>

				{(props.token === null || props.token === undefined ? <div /> : <MenuItem onClick={handleMenuClose}> <Button color="inherit">Manage</Button></MenuItem>)}
				<Divider />
				<MenuItem onClick={handleMenuClose}>
					{(props.token === null || props.token === undefined ? <Login updateToken={props.updateToken} /> : <Logout updateToken={props.updateToken} />)}
				</MenuItem>
			</Menu>
		</div>
	);
}

export default MobileMenu;