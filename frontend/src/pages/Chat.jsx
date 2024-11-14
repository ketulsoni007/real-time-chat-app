import { Box, Button, Typography, List, ListItem, ListItemText, TextField, IconButton, Paper, ClickAwayListener, Tooltip, Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/Slices/authSlice';
import SendIcon from '@mui/icons-material/Send'; // You can use any icon for sending the message
import GroupModel from '../components/GroupModel';
import { chatStoreApi, MergeChats, OpenGroupModel, SelectedUser } from '../../../frontend/src/store/Slices/chatSlice';
import { chatListApi } from '../store/Slices/chatSlice';
import ListUser from './List';
import StartConversation from "../assets/starts.jpg";
import moment from 'moment';
import config from '../config';
import { io } from 'socket.io-client';

const socket = io(config?.SOCKET_URL);

const Chat = () => {
  const dispatch = useDispatch();
  const isOpenGroupModel = useSelector((state) => state.chat.isOpenGroupModel);
  const isSelectedUser = useSelector((state) => state.chat.isSelectedUser);
  console.log('isSelectedUser: ', isSelectedUser);
  const isGroupChat = useSelector((state) => state.chat.isGroupChat);
  const isChatList = useSelector((state) => state.chat.isChatList);
  const isChatHistory = useSelector((state) => state.chat.isChatHistory);
  // console.log('isChatHistory: ', isChatHistory);
  const user = useSelector((state) => state.auth.user);
  const groups = isChatList && isChatList?.groupList?.length > 0 ? isChatList?.groupList : [];
  const userList = isChatList && isChatList?.userList?.length > 0 ? isChatList?.userList : [];
  const [userDetail, setUserDetail] = useState('');
  const [groupUser, setGroupUser] = useState([]);
  const [count, setCount] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const storage = localStorage.getItem('real-time-chat-auth');
  const tokenData = storage ? JSON.parse(storage) : {};
  const token = tokenData?.isToken || null;

  // Handle Tooltip Open/Close
  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  useEffect(() => {
    if (isGroupChat) {
      // Directly match the group ID with isSelectedUser
      const groupDetail = groups.find((group) => group._id === isSelectedUser);
      if (groupDetail) {
        setUserDetail(groupDetail);
        setGroupUser(groupDetail?.users);
      }
    } else {
      // For 1-to-1 user chat, find the user from userList
      const userDetail = userList.find((user) => user._id === isSelectedUser);
      setUserDetail(userDetail);
      setGroupUser([]);
    }
  }, [isGroupChat, isSelectedUser, groups, userList]);

  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      dispatch(chatStoreApi({ isGroupChat: isGroupChat, content: message, receiver: userDetail?._id, groupId: isGroupChat ? userDetail?._id : null })).then(()=>{
        setMessage('');
      })
    }
  };

  useEffect(() => {
    dispatch(chatListApi({}))
  }, [token])

  useEffect(() => {
    if (isSelectedUser) {
      if (isGroupChat) {
        socket.emit("join-group-room", isSelectedUser);
      } else {
        socket.emit("join-private-room", isSelectedUser);
      }
  
      const messageHandler = (newMessage) => {
        console.log('newMessage: ', newMessage);
        dispatch(MergeChats(newMessage));
      };
  
      socket.on("receive_message", messageHandler);
  
      return () => {
        socket.off("receive_message", messageHandler);
      };
    }
  }, [isSelectedUser, isGroupChat, chatStoreApi]);




  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh', p: 0 }}>
        <Box sx={{ width: { xl: '400px', lg: '300px', md: '300px', xs: '250px' }, backgroundColor: '#f4f4f4', padding: 2 }}>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Avatar sx={{mb:1,width:'80px',height:'80px'}}>{user?.user_name?.charAt(0)}</Avatar>
          <Typography>{user?.user_name}</Typography>
          <Typography sx={{mb:2}}>{user?.email}</Typography>
          <Button onClick={() => dispatch(logout())} fullWidth variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
            Logout
          </Button>
          <Button fullWidth variant="contained" color="primary" sx={{ marginBottom: 2 }} onClick={() => dispatch(OpenGroupModel(true))}>
            New Group
          </Button>
        </Box>
          <ListUser />
        </Box>
        {isSelectedUser ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            <Paper elevation={0} sx={{ p: 2, borderBottom: '1px solid #EEE' }}>
              <Typography variant="h5">
                {userDetail && isGroupChat ? userDetail?.groupName : userDetail ? userDetail?.user_name : null}
              </Typography>
              {isGroupChat && userDetail?.groupName ? (
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <div>
                    <Tooltip
                      title={
                        <List dense>
                          {groupUser && groupUser?.length > 0 ? (
                            groupUser?.map((partician, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={partician?.user_name} />
                              </ListItem>
                            ))
                          ) : null}
                        </List>
                      }
                      open={tooltipOpen}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      onClose={handleTooltipClose}
                      PopperProps={{
                        disablePortal: true,
                        anchorEl: document.getElementById('tap-here-more-info'),
                        placement: 'bottom-start', // Adjust placement as needed
                      }}
                    >
                      <Typography
                        id="tap-here-more-info" // Adding an ID to target with anchorEl
                        variant="body2"
                        onClick={handleTooltipOpen}
                        sx={{ cursor: 'pointer', color: '#007bff' }}
                      >
                        +Tap here for more info
                      </Typography>
                    </Tooltip>
                  </div>
                </ClickAwayListener>
              ) : null}
            </Paper>
            <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: 2, p: 2 }}>
              {isChatHistory && isChatHistory?.length > 0 ? (
                isChatHistory.map((item, i) => {
                  const createdAt = item?.createdAt ? moment(item?.createdAt).format('DD-MM-YYYY hh:mm A') : null;
                  return (
                    <Box key={i} sx={{ display: 'flex', flexDirection: item.sender?._id === user?._id ? 'row-reverse' : 'row', marginBottom: 2 }}>
                      <Box sx={{ maxWidth: '70%', padding: 1, backgroundColor: item.sender?._id === user?._id ? '#0084FF' : '#E4E6EB', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: item.sender?._id === user?._id ? '#fff' : '#000' }}>
                          {item.content}
                        </Typography>
                        <Typography variant="body2" sx={{ color: item.sender?._id === user?._id ? '#fff' : '#000', fontSize: '0.50rem', alignSelf: 'flex-end' }}>
                        {createdAt}
                      </Typography>
                      </Box>
                    </Box>
                  )
                })
              ) : null}
              {/* {messages.map((msg, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: msg.sender === "You" ? 'row-reverse' : 'row', marginBottom: 2 }}>
                <Box sx={{ maxWidth: '70%', padding: 1, backgroundColor: msg.sender === "You" ? '#0084FF' : '#E4E6EB', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: msg.sender === "You" ? '#fff' : '#000' }}>
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            ))} */}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <TextField
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                variant="outlined"
                sx={{ marginRight: 1 }}
              />
              <IconButton onClick={handleSendMessage} color="primary">
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              height: '100vh', // Full viewport height
              textAlign: 'center',
              width: '100%'
            }}
          >
            <Avatar
              src={StartConversation}
              sx={{
                width: { xs: '150px', sm: '200px', md: '250px' }, // Responsive width for different screen sizes
                height: { xs: '150px', sm: '200px', md: '250px' }, // Responsive height for different screen sizes
                borderRadius: 0,
                objectFit: 'cover'
              }}
            />
            <Typography sx={{ mt: 2, fontSize: { xs: '14px', sm: '16px', md: '18px' }, color: '#000' }}>
              Select user or group to start conversations
            </Typography>
          </Box>
        )}
      </Box>
      {isOpenGroupModel && (<GroupModel />)}
    </>
  );
}

export default Chat;
