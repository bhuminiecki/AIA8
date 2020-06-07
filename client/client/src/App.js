import React, { useState, useEffect }
from "react";
import io from "socket.io-client";
import Input from "./components/Input"

const socket = io("http://localhost:7000");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    socket.on('message', data => {
      console.log(data)
      setMessages(m => [...m, data]);
    });
  }, []);

  useEffect(() => {
    socket.on('user', data => {
      console.log(data)
      setUsers(u => [...u, data]);
      let message = { user: data.user, message: ' has joined the chat'}
      setMessages(m => [...m, message]);
    });
  }, []);

  useEffect(() => {
    socket.on('loggedIn', data => {
      setIsLoggedIn(data);
    });
  }, []);

  useEffect(() => {
    socket.on('disconnected', data => {
      console.log(data)
      console.log(users)
      let user = users.find(user => user.socketId === data)
      if (user !== undefined) {
        setUsers([...users.filter(user => user.socketId !== data)]);
        let message = { user: user.user, message: ' has left the chat'}
        setMessages(m => [...m, message]);
      }
    });
  });

  const send = (message) => {
    socket.emit('message', { user: userName, message: message});
  }

  const login = (name) => {
    setUserName(name)
    socket.emit('login', {user: name, socketId: socket.id})
  }

  if(isLoggedIn) {
    return ( 
      <div>
        <div>
          <ul>
            {messages.map(m => <li> {`${m.user}: ${m.message}`} </li>)}
          </ul>
          <Input send = {send} buttonText = 'Send'/>
        </div>
        <div>
          <p>Users</p>
          <ul>
            {users.map(u => <li>{u.user}</li>)}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <Input send = {login} buttonText = 'Log in'/>
        </div>
        <div>
          <p>Users</p>
          <ul>
            {users.map(u => <li>{u.user}</li>)}
          </ul>
        </div>
      </div>
    )
  }
}