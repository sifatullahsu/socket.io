import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import sendIcon from "./assets/send.svg";
import useChatScroll from "./hooks/useChatScroll";

function App() {
  const socket = useMemo(() => io("http://192.168.10.42:5000"), []);

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);

  const ref = useChatScroll(messages);

  const chatHandler = (e) => {
    e.preventDefault();

    const payload = {
      name,
      message: e.target.message.value,
    };

    setMessages((p) => [...p, payload]);
    socket.emit("message", { ...payload, roomId });
    e.target.reset();
  };

  const roomHandler = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const roomId = e.target.room.value;

    setName(name);
    setRoomId(roomId);
    socket.emit("join-room", { roomId, name });
    e.target.reset();
  };

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("receive-message", (data) => {
      setMessages((p) => [...p, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="max-w-[700px] mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold text-center mb-10">
        Express + React + Socket.io
      </h2>

      {roomId ? (
        <>
          <div className="flex justify-center mb-2 space-x-10">
            <div className="text-sm mb-1">Name: {name}</div>
            <div className="text-sm mb-1">Room ID: {roomId}</div>
          </div>
          <div className="bg-[#3F424A] space-y-5 p-5 md:p-10 rounded-xl">
            <div
              ref={ref}
              className="space-y-1 h-[620px] overflow-y-auto messages"
            >
              {messages.map((i, index) => {
                const isMe = name === i.name;
                const backToBack = messages[index - 1]?.name === i.name;

                return (
                  <div
                    key={index}
                    className={`${isMe ? "text-right" : "text-left"} `}
                  >
                    <div
                      className={`text-xs mb-1 text-[#ABABAB] ${
                        backToBack ? "hidden" : "block"
                      }`}
                    >
                      {i.name}
                    </div>
                    <div
                      className={`${
                        isMe ? "bg-[#28303F]" : "bg-[#4B4F5B]"
                      }  px-2 py-1 text-sm rounded-lg inline-block max-w-[90%] md:max-w-[80%]`}
                    >
                      {i.message}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative">
              <form onSubmit={chatHandler}>
                <input
                  type="text"
                  name="message"
                  placeholder="Write message here..."
                  className="w-full pr-10"
                  required
                />
                <button className="absolute top-1/2 -translate-y-1/2 right-4">
                  <img src={sendIcon} alt="" />
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <form
            onSubmit={roomHandler}
            className="flex justify-center items-center flex-col md:flex-row gap-3 text-center"
          >
            <input
              type="text"
              name="name"
              placeholder="Enter your name..."
              required
            />
            <input
              type="text"
              name="room"
              placeholder="Enter roomId..."
              required
            />
            <div>
              <button className="rr-custom">Join Room</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
