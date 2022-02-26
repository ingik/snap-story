import  Box  from '@mui/material/Box';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import axios from 'axios';
import { Avatar, Button, TextField, Typography,InputAdornment  } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ImageBoardComment from './ImageBoardComment';
import ImageBoardUser from './ImageBoardUser';
import './ImageBoard.css'

import Recommand from '../../../moduls/Recommand'
import UnRecommand from '../../../moduls/UnRecommand'




import { useSelector,shallowEqual } from 'react-redux'

function ImageBoard(props) {
  const ListRef = useRef({ x: 0, y: 0 });

  const UserSelectData = useSelector(
    (state) => state.user.userData,
    shallowEqual
  );



  const [UserData, setUserData] = useState({});
  const [ImageDataList, setImageDataList] = useState([]);
  const [Comment, setComment] = useState("");
  const [ListComment, setListComment] = useState([]);
  const [Body, setBody] = useState({});
  const [CommentStatus, setCommentStatus] = useState(0)
  const [Number,setNumber] = useState(0)
  const [RecommandDisplay, setRecommandDisplay] = useState()



  const onLeftMove = (event) => {

    console.log(Number)
    if (Number <= 0) {
      return console.log("firstpage");
    }

    setNumber(Number - 1)
    ListRef.current.style.transition = "300ms";
    ListRef.current.style.transform = ListRef.current.style.transform + `translateX(500px)`;
    console.log("Left");
  };
  
  const onRightMove = () => {
    
    console.log(Number)
    console.log(ImageDataList.length);
    
    if (Number >= ImageDataList.length - 1) {
      return console.log("lastpage");
    }
    setNumber(Number + 1)

    ListRef.current.style.transition = "400ms";
    ListRef.current.style.transform = ListRef.current.style.transform + `translateX(-500px)`;
    console.log("right");
  };

  useEffect(() => {
    axios.get("/api/boards/imageBoard/" + props.paramKey).then((response) => {
      if (response.data) {
        console.log(response.data)
        setUserData(response.data);
        setImageDataList(response.data[0].image);
      } else {
        console.log("no imageBoardData");
      }
    });
  }, []);
  
  
  useEffect(() => {
    console.log('ImageDataList')
    ListRef.current.style.width = ImageDataList.length * 500 + "px";
  }, [ImageDataList]);

  const none = {
    position: "absolute",
    zIndex: 9999,
    color: "gray",
    opacity: 0.6,
    top: "calc(50% - 25px)",
    left: "calc(50% - 25px)",
    display: "none",
    fontSize: "50px",
  };

  const display = {
    position: "absolute",
    zIndex: 9999,
    color: "gray",
    opacity: 0.6,
    top: "calc(50% - 25px)",
    left: "calc(50% - 25px)",
    display: "inline",
    fontSize: "50px",
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {

      boardId : UserData[0]._id,
      commentList : {
        userId : UserSelectData._id,
        content : Comment 
      }

    };

    setCommentStatus(CommentStatus + 1)
    // CommentStatus = true

    axios.post("/api/boards/imageBoardComment", body).then((response) => {
      setComment("");

      if (response.data) {
        console.log(response.data);
      } else {
        console.log("Comment Data null");
      }
    });
  };

  const onCommentHandler = (event) => {
    setComment(event.currentTarget.value);
  };



  // Recommand 

  const onRecommandHandler = () => {
    Recommand(UserData[0]._id,UserSelectData._id) 
    // setUpdateFollow(test)
  }

  const onUnRecommandHanler = () => {
    UnRecommand(UserData[0]._id,UserSelectData._id) 
    // setUpdateFollow(test)
  }
 
  const RecommandFunc = () => {
    if (RecommandDisplay === false) {
      return <FavoriteBorderIcon onClick={onRecommandHandler}>follow</FavoriteBorderIcon>;
    } else {
      return <FavoriteIcon onClick={onUnRecommandHanler}>Unfollow</FavoriteIcon>;
    }
  }

  



  return (
    <div>
      {/* ImageBoardComponent InfoBar 부분  */}

      {/* Image  */}
      <div
        style={{
          width: "500px",
          margin: "auto",
          overflowX: "hidden",
          display: "inline-block",
          position: "relative",
        }}
      >
        <div
          className="LeftButton"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "20%",
            height: "100%",
            zIndex: 1000,
          }}
          onClick={onLeftMove}
        >
          <ArrowBackIosNewIcon
            style={Number <= 0 ? none : display}
            fontSize="large"
          />
        </div>

        <div
          className="RigthButton"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "20%",
            height: "100%",
            zIndex: 9999,
          }}
          onClick={onRightMove}
        >
          <ArrowForwardIosIcon
            style={Number >= ImageDataList.length - 1 ? none : display}
            fontSize="large"
          />
        </div>
        {/* 리스트사이즈 가변적일 필요가 이씀 */}

        <div
          style={{
            position: "relative",
            width: "",
            margin: "auto",
            paddingBottom: "30px",
            transform: `translateX(0)`,
          }}
          ref={ListRef}
        >
          {ImageDataList?.map((image, index) => (
            <div
              style={{
                height: "500px",
                width: "500px",
                float: "left",
                display: "inline-block",
              }}
              key={index}
            >
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Box
                  component="img"
                  sx={{
                    height: "500px",
                    width: "500px",
                    float: "left",
                    display: "table",
                  }}
                  alt={image.name}
                  src={image.img}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rigthBox"
        style={{ position: "absolute", display: "inline-block" }}
      >
        <List>
          <ImageBoardUser userId={UserData[0]?.user}/>
        </List>
        <div className="ScrollbarStyle">
          <List style={{padding :'8px 16px'}}>
            <div> {UserData[0]?.content}</div>
          </List>
          <List>
              <ImageBoardComment paramKey={ props.paramKey } CommentStatus={ CommentStatus }/>
          </List>
        </div>
        <div className="buttonMenu">
          { RecommandFunc() }
        </div>
        <div className="commentCreate" style={{ width: "100%" }}>
          <form onSubmit={onSubmitHandler}>
            <TextField 
            value={Comment} 
            onChange={onCommentHandler} 
            style={{width:'100%',padding:'0'}}
            variant='standard'
            InputProps={{
              endAdornment: <Button onClick={onSubmitHandler} postion="end">작성</Button>
            }}
            >
            </TextField>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImageBoard;
