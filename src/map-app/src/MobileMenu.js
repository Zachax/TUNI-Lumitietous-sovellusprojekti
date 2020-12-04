/**
Piirtää pienellä näytöllä valikon kirjautuneelle käyttäjälle

Luonut: Markku Nirkkonen

Viimeisin päivitys

2.12.2020 Markku Nirkkonen
Korjattu niin, että uloskirjautuessa näkymä palaa karttaan

**/

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

	// TODO: Name of the signed in user to be shown
	return (
		<div className="mobilemenu">
			<IconButton 
				//edge="start" 
				color="inherit" 
				onClick={handleMenu}
			>
				<Typography>"NAME"</Typography>
				<AccountCircleIcon />
			</IconButton>
			<Menu
				id="menu-appbar"
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

				{(props.token === null || props.token === undefined ? <div /> : <MenuItem onClick={handleMenuClose}> <Button color="inherit" onClick={props.updateView}>{props.manageOrMap}</Button></MenuItem>)}
				<Divider />
				<MenuItem onClick={handleMenuClose}>
					{(props.token === null || props.token === undefined ? <Login updateToken={props.updateToken} /> : <Logout updateToken={props.updateToken} viewManagement={props.viewManagement} updateView={props.updateView}/>)}
				</MenuItem>
			</Menu>
		</div>
	);
}

export default MobileMenu;