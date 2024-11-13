import { Avatar, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';

const ListUser = () => {
    const isChatList = useSelector((state) => state.chat.isChatList);
    console.log('isChatList: ', isChatList);
    const groups = isChatList && isChatList?.groupList?.length > 0 ? isChatList?.groupList : [];
    console.log('groups: ', groups);
    const userList = isChatList && isChatList?.userList?.length > 0 ? isChatList?.userList : [];

  return (
    <>
        <Typography variant="h6" gutterBottom>
          Groups
        </Typography>
        <List>
        {groups.length > 0 &&
          groups.map((item, index) => (
            <ListItem button key={index}>
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
        <Typography variant="h6" gutterBottom>
          User
        </Typography>
        <List>
        {userList.length > 0 &&
            userList.map((item, index) => (
            <ListItem button key={index}>
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
    </>
  )
}

export default ListUser;