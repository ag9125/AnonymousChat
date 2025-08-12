# 🕵️ Anonymous Real-Time Chat Application

A **full-stack real-time chat application** with an **anonymous messaging** feature, public/private chat rooms, and live user presence indicators.  
Built using **React, Redux Toolkit, Node.js, Express, Socket.IO, and MongoDB**.

---

## 🚀 Features

- **Anonymous Messaging** – Chat with others without revealing your identity.
- **Public & Private Rooms** – Create and join password-protected rooms.
- **Real-Time Communication** – Instant message updates using Socket.IO.
- **User Presence & Typing Indicators** – See when others are online and typing.
- **JWT Authentication** – Secure user sessions.
- **Message Persistence** – All messages stored in MongoDB with timestamps.
- **Responsive UI** – Built with Tailwind CSS for mobile and desktop support.
- **Media-Ready** – Architecture supports files, images, audio, and video messages.

---

## 🛠 Tech Stack

**Frontend**  
- React  
- Redux Toolkit  
- Tailwind CSS  
- React Icons  
- react-hot-toast

**Backend**  
- Node.js + Express.js  
- Socket.IO (real-time WebSocket communication)  
- MongoDB + Mongoose  
- JWT Authentication  
- Bcrypt for password hashing

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
git clone https://github.com/your-username/anonymous-chat-app.git
cd anonymous-chat-app


### 2️⃣ Install dependencies

**Backend**
cd server
npm install



**Frontend**
cd client
npm install



### 3️⃣ Environment Variables

**In the `/server` folder**, create a `.env` file:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret



**In the `/client` folder**, create a `.env` file:
REACT_APP_SOCKET_URL=http://localhost:5000



### 4️⃣ Run the app

**Backend**
cd server
npm run dev



**Frontend**
cd client
npm start


---

## 📡 Socket.IO Events

**Client → Server**
- `joinRoom` – join a specific chat room
- `leaveRoom` – leave the current room
- `sendMessage` – send a new chat message
- `typing` – emit when user is typing
- `stopTyping` – emit when user stops typing

**Server → Client**
- `newMessage` – broadcasted when a message is sent in a room
- `userJoined` – a user joined the room
- `userLeft` – a user left the room
- `typing` – receive when another user starts typing
- `stopTyping` – receive when another user stops typing
- `messageDeleted` – when a message is deleted

---
