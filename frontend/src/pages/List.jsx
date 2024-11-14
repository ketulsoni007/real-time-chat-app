import { Avatar, List, ListItem, ListItemIcon, ListItemText, Skeleton, Typography } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { chatHistoryApi, SelectedUser } from '../store/Slices/chatSlice';

const ListUser = () => {
  const dispatch = useDispatch();
    const isChatList = useSelector((state) => state.chat.isChatList);
    const isApiStatus = useSelector((state) => state.chat.isApiStatus);
    const listLoading = isApiStatus?.chatListApi === 'loading';
    const isSelectedUser = useSelector((state) => state.chat.isSelectedUser);
    const groups = isChatList && isChatList?.groupList?.length > 0 ?  isChatList?.groupList.filter(item => item?.isGroupChat === true) : [];
    const userList = isChatList && isChatList?.userList?.length > 0 ? isChatList?.userList : [];
  return (
    <>
        <Typography variant="h6" gutterBottom>
          Groups
        </Typography>
        {listLoading ? (
          <List sx={{ maxHeight: 'calc(100vh - 650px)', overflowY: 'auto' }}>
          {[...Array(10)].map((_, index) => (
            <ListItem key={index}>
              <Skeleton variant="text" width="100%" height={40} animation='wave' />
            </ListItem>
          ))}
        </List>
        ) : (
          <List sx={{maxHeight:'calc(100vh - 650px)',overflowY:'auto'}}>
        {groups.length > 0 && 
          groups.map((item, index) => (
            <ListItem sx={{backgroundColor:isSelectedUser === item?._id ? '#FFF' : 'inherit'}} button key={index} onClick={()=>{
              dispatch(SelectedUser({_id:item?._id,group:true}));
              dispatch(chatHistoryApi({isGroupChat:true,groupId:item?._id}));
            }}>
            <ListItemIcon>
                <Avatar>{item?.groupName?.charAt(0)}</Avatar>
              </ListItemIcon>
              <ListItemText primary={item?.groupName} secondary={
                  <Typography noWrap>
                    {item?.latestMessage?.content ?? null}
                  </Typography>
                } />
            </ListItem>
          ))}
        </List>
        )}
        
        <Typography variant="h6" gutterBottom>
          User
        </Typography>
        {listLoading ? (
          <List sx={{ maxHeight: 'calc(100vh - 650px)', overflowY: 'auto' }}>
          {[...Array(10)].map((_, index) => (
            <ListItem key={index}>
              <Skeleton variant="text" width="100%" height={40} animation='wave' />
            </ListItem>
          ))}
        </List>
        ) : (
        <List sx={{maxHeight:'calc(100vh - 650px)',overflowY:'auto'}}>
        {userList.length > 0 &&
            userList.map((item, index) => (
            <ListItem button sx={{backgroundColor:isSelectedUser === item?._id ? '#FFF' : 'inherit'}} key={index} onClick={()=>{
              dispatch(SelectedUser({_id:item?._id,group:false}))
              dispatch(chatHistoryApi({isGroupChat:false,groupId:null,receiver:item?._id}));
            }}>
            <ListItemIcon>
                <Avatar>{item?.user_name?.charAt(0)}</Avatar>
              </ListItemIcon>
              <ListItemText primary={item?.user_name} secondary={
                  <Typography noWrap>
                    {item?.email ?? null}
                  </Typography>
                } />
            </ListItem>
          ))}
        </List>
        )}
    </>
  )
}

export default ListUser;