import { Box, Button, Typography, List, ListItem, ListItemText, TextField, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/Slices/authSlice';
import SendIcon from '@mui/icons-material/Send'; // You can use any icon for sending the message
import GroupModel from '../components/GroupModel';
import { OpenGroupModel } from '../../../frontend/src/store/Slices/chatSlice';
import { chatListApi } from '../store/Slices/chatSlice';
import ListUser from './List';

const Chat = () => {
  const dispatch = useDispatch();
  const isOpenGroupModel = useSelector((state) => state.chat.isOpenGroupModel);
  console.log('isOpenGroupModel: ', isOpenGroupModel);
  
  // Dummy chat data for users and messages
  const [messages, setMessages] = useState([
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
    { sender: "User 1", content: "Hello!" },
    { sender: "User 2", content: "Hi, how are you?" },
  ]);

  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: "You", content: message }]);
      setMessage('');
    }
  };

  useEffect(() => {
   dispatch(chatListApi({}))
  }, [])
  
  


  return (
    <>
    <Box sx={{ display: 'flex', height: '100vh',p:0 }}>
      <Box sx={{   width: { xl: '400px', lg: '300px', md: '300px',xs:'250px' }, backgroundColor: '#f4f4f4', padding: 2 }}>
        <Button onClick={() => dispatch(logout())} fullWidth variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
          Logout
        </Button>
        <Button fullWidth variant="contained" color="primary" sx={{ marginBottom: 2 }} onClick={()=>dispatch(OpenGroupModel(true))}>
          New Group
        </Button>
        <ListUser />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Chat with User 1
        </Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: 2 }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: msg.sender === "You" ? 'row-reverse' : 'row', marginBottom: 2 }}>
              <Box sx={{ maxWidth: '70%', padding: 1, backgroundColor: msg.sender === "You" ? '#0084FF' : '#E4E6EB', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: msg.sender === "You" ? '#fff' : '#000' }}>
                  {msg.content}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
    </Box>
      {isOpenGroupModel && (<GroupModel/>)}
    </>
  );
}

export default Chat;
