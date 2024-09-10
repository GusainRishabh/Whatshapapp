import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [chatStarted, setChatStarted] = useState(false);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
      socket.off('message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (username) {
      socket.emit('join', username);
      setChatStarted(true);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>WhatsApp Clone</h1>
      </header>
      {!chatStarted ? (
        <div style={styles.loginContainer}>
          <form onSubmit={handleJoin} style={styles.form}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Join Chat</button>
          </form>
        </div>
      ) : (
        <div style={styles.chatContainer}>
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} style={styles.message}>
                <strong>{msg.user}</strong>: {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    fontFamily: '"Roboto", sans-serif',
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#128C7E',
    color: '#fff',
    padding: '15px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    margin: '20px',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    margin: '20px',
  },
  messages: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    borderBottom: '1px solid #ddd',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    backgroundColor: '#e5ddd5',
  },
  message: {
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#fff',
    marginBottom: '10px',
    maxWidth: '70%',
    wordBreak: 'break-word',
  },
  form: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    backgroundColor: '#f1f1f1',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginRight: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#128C7E',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default App;
