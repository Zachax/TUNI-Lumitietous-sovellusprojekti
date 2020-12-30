/**
Luo pienellä näytöllä valikon kirjautuneelle käyttäjälle käyttäjäikonin taakse

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
import Dialog from '@material-ui/core/Dialog';
import Login from './Login';
import Logout from './Logout';
import EditOwn from './EditOwn';

function MobileMenu(props) {
  // Hooks
	const [anchorElMenu, setAnchorElMenu] = React.useState(null);
	const [ editOwnOpen, setEditOwnOpen ] = React.useState(false);
	
	const menuOpen = Boolean(anchorElMenu);  

  // Event handlers
	
	// Asettaa menun paikan klikattuun elementtiin
	const handleMenu = event => {
		setAnchorElMenu(event.currentTarget);
	};
    
	// Sulkee menun
	const handleMenuClose = () => {
		setAnchorElMenu(null);
	};

	const openEditOwn = () => {
    setEditOwnOpen(true);
  }

  const closeEditOwn = () => {
    setEditOwnOpen(false);
  }

	return (
		<div className="mobilemenu">
			
			{/* Painike, joka avaa menun */}
			<IconButton 
				//edge="start" 
				color="inherit" 
				onClick={handleMenu}
			>
				<Typography>{(props.user !== null && props.user !== undefined) ? props.user.Etunimi : "Nimeä ei löydy"}</Typography>
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
				
				{/* Näytetään omat tiedot -painike ja vaihtuva painike näytettävän ruudun mukaan */}
				{!props.viewManagement ? <div /> : <MenuItem><Button color="inherit" onClick={openEditOwn}>Omat tiedot</Button></MenuItem>}
				{(props.token === null || props.token === undefined ? <div /> : <MenuItem onClick={handleMenuClose}> <Button color="inherit" onClick={props.updateView}>{props.manageOrMap}</Button></MenuItem>)}
				<Divider />
				<MenuItem onClick={handleMenuClose}>
					
					{/*painikkeet kirjaudu / kirjaudu ulos tilanteen mukaan */}
					{(
						props.token === null || props.token === undefined 
						? 
						<Login updateToken={props.updateToken} updateUser={props.updateUser} /> 
						: 
						<Logout updateToken={props.updateToken} updateUser={props.updateUser} viewManagement={props.viewManagement} updateView={props.updateView}/>
					)}
				</MenuItem>
			</Menu>
			<Dialog
				onClose={closeEditOwn}
				open={editOwnOpen}
			>
				<EditOwn user={props.user} token={props.token} closeEditOwn={closeEditOwn} updateUser={props.updateUser}/>
			</Dialog>
		</div>
	);
}

export default MobileMenu;