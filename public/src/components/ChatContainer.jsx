import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sentMessageRoutes, getAllMessageRoutes } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({ currnetChat, currentUser, socket }) => {
  const scrollRef = useRef();
  const [messgae, setMessage] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  useEffect(() => {
    const fetchCurrentChat = async () => {
      if (currnetChat && currentUser) {
        try {
          const response = await axios.post(getAllMessageRoutes, {
            from: currentUser._id,
            to: currnetChat._id,
          });
          setMessage(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchCurrentChat();
  }, [currnetChat, currentUser]);

  const handleSentMsg = async (msg) => {
    if (currnetChat && currentUser) {
      try {
        await axios.post(sentMessageRoutes, {
          from: currentUser._id,
          to: currnetChat._id,
          message: msg,
        });
        socket.current.emit("send-msg", {
          to: currnetChat._id,
          from: currentUser._id,
          message: msg,
        });

        const msgs = [...messgae];
        msgs.push({ fromSelf: true, message: msg });
        setMessage(msgs);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, );

  useEffect(() => {
    arrivalMessage && setMessage((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messgae]);

  return (
    <>
      {currnetChat && currentUser && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={currnetChat.avatarImage} alt="avatar" />
              </div>
              <div className="username">
                <h3>{currnetChat.username}</h3>
              </div>
            </div>
          </div>
          <div className="chat-messages">
            {messgae.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                    key={message._id} // Added unique key
                  >
                    <div className="content">
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSentMsg} />
        </Container>
      )}
    </>
  );
};

export default ChatContainer;

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  overflow: hidden;
  gap: 0.1rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-auto-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #f9f9f9;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #3a69e4;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #253c78;
      }
    }
  }
`;
