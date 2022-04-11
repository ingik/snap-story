import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Profile from '../Profile/Profile';
import SideAppBar from './SideAppBar';
import ForumIcon from '@mui/icons-material/Forum';
import { withRouter } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import {  Avatar, List, ListItem, ListItemAvatar, ListItemText, Modal } from '@mui/material';
import { useSelector } from 'react-redux';
import UploadIcon from '@mui/icons-material/Upload';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ImageBoardUpload from '../ImageBoard/ImageBoardUpload';

import './AppBar.css'


import useMediaQuery from '@mui/material/useMediaQuery';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));





function SearchAppBar(props) {


  
  // const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [SearchValue, setSearchValue] = useState("");
  const [UserList, setUserList] = useState(null);

  const userData = useSelector(state => state.user.userData)
  console.log(userData)

  const mediaQuery = useMediaQuery('(min-width:641px)');


  // search list 

  const [anchorEl, setAnchorEl] = useState(null);
  const [OnOff, setOnOff] = useState(false)
  // const open = Boolean(anchorEl);

  const handleClose = () => {

    console.log('handleClose')
    setAnchorEl(null);
    setSearchValue("","")
    setUserList(null)
    setOnOff(false)
  };


  const onSearchHanler = (event) => {
    event.preventDefault()

    setSearchValue(event.currentTarget.value)
    console.log(event.target.value)
    let body = {
      name : event.currentTarget.value 
    }

    
    
    if(event.currentTarget.value){
      axios.post('/api/users/list',body).then(response => {
        console.log(response.data)
        setUserList(response.data)
      })
      setAnchorEl(event.currentTarget)
    } else {
      handleClose()
    }
    
    setUserList(null)

 
  }

  //modal

  const [ModalOpen, setModalOpen] = React.useState(false);
  //  const handleOpen = () => setOpen(true);
   const ModalhandleClose = () => setModalOpen(false);

  const onHomeButtonHandler = () => {
    props.history.push('/')
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width:'84vw',
    height:'66vh',
    boxShadow: 24,
    p: 4,
    padding:'0'
  };

  const mobileStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width:'90vw',
    height:'80vh',
    boxShadow: 24,
    p: 4,
    padding:'0'
  }

  const searchUserList = {
    position: "absolute",
    zIndex: "99",
    backgroundColor: "white",
    maxHeight: "25em",
    overflowY: "scroll",
    width: "30vw",
    paddingBottom: 0,
    borderRadius: "5px",
  }
  const searchUserListSmall = {
    position: "absolute",
    zIndex: "99",
    backgroundColor: "white",
    maxHeight: "25em",
    overflowY: "scroll",
    width: "100%",
    paddingBottom: 0,
    borderRadius: "5px",
  }


  return (
    <React.Fragment>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="inherit"
        style={{
          position: "fixed",
          backgroundColor: "",
          zIndex: "200",
          top: 0,
        }}
      >
        <Toolbar>
          {/* SidsAppBar Component */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <SideAppBar propsData={props} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            onClick={onHomeButtonHandler}
          >
            SNAP STORY
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={SearchValue}
              onChange={onSearchHanler}
            />

            <List
              // className={
              //   mediaQuery ?
              //   `searchList` :
              //   `searchListSmall`
              // }
              style={
                mediaQuery ? 
                searchUserList :
                searchUserListSmall
              }
              anchorEl={anchorEl}
              open={OnOff}
              onClose={handleClose}
            >
              {UserList && UserList.map((item) => {
                return (
                  <ListItem
                    key={item.name}
                    // style={{ width: "100%" }}
                    onClick={() => {
                      console.log(props);
                      console.log(item._id);
                      if (userData._id === item._id) {
                        props.history.push("/profile");
                        setOnOff(false);
                        setUserList([]);
                        setSearchValue("");
                      } else {
                        props.history.push("/profile/" + item._id);
                        setOnOff(false);
                        setUserList([]);
                        setSearchValue("");
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar alt={item.name} src={item.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{
                              display: "inline-block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "clip",
                              width: "20vw",
                            }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {item.intro}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={() => {
                props.history.push("/");
              }}
            >
              <FormatListBulletedIcon />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={() => {
                props.history.push("/imageBoardCmp");
              }}
            >
              <HomeIcon />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={()=>{setModalOpen(true)}}
            >
              <UploadIcon />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={()=>{
                props.history.push("/chat/list")
              }}
            >
              <Badge  color="error">
                <ForumIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge 
                // badgeContent={7} 
                color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>


          <Profile Data={props} />
          
        </Toolbar>
      </AppBar>
      {/* {renderMobileMenu} */}
      <Modal
            open={ModalOpen}
            onClose={ModalhandleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={mediaQuery ?
                    style :
                    mobileStyle}>
              <ImageBoardUpload handleClose={handleClose} />
            </Box>
          </Modal>
    </Box>
    </React.Fragment>
  );
}

export default React.memo(withRouter(SearchAppBar))