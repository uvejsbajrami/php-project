import React, { useEffect, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLocalStorage } from "@uidotdev/usehooks";
import "../styles/UserChatDesign.css";
import axios from "axios";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import EmojiPicker from "emoji-picker-react";
import { EmojiKeyboard } from "reactjs-emoji-keyboard";
import CloseIcon from "@mui/icons-material/Close";

function UserChatDesign({ userChatData, selectedUserId }) {
  const [user, setUser] = useLocalStorage("user");
  const [storageEmoji, setStorageEmoji] = useLocalStorage("emoji", null);
  const [sendEmojiState, setSendEmojiState] = useState(false);
  const [emojis, setEmojis] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [userChatData]);

  const handleDeleteMessage = (e, messageID) => {
    e.preventDefault();
    console.log(messageID);
    if (messageID !== undefined) {
      axios
        .get(
          `http://localhost/php-full-project/php-project/api/api.php?action=delete_user_message&id=${messageID}`
        )
        .then((res) => console.log(res.data));
      window.location.reload(true);
    }
  };
  if (!userChatData) {
    return (
      <div className="d-flex align-items-start gap-3 m-4" ref={bottomRef}>
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      </div>
    );
  }
  const handleEmojiClick = (event, messageId) => {
    setStorageEmoji(event.character);
    const emojiSend = {
      action: "messages_react",
      messages_id: messageId,
      user_id: user.id,
      emoji: storageEmoji,
    };
    if (storageEmoji !== null) {
      axios
        .post(
          "http://localhost/php-full-project/php-project/api/api.php",
          emojiSend
        )
        .then((res) => {
          if (res.data.status === 1) {
            setStorageEmoji(null);
          }
        });
    }
  };

  const handleSendEmoji = () => {
    setSendEmojiState(!sendEmojiState);
  };

  return (
    <div className="d-flex align-items-start gap-3 m-4" ref={bottomRef}>
      <div className="chat-div">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold name-text">
            UserId:{" "}
            {userChatData.sender_id == user.id ? "You" : userChatData.sender_id}
          </span>
          <span
            className="text-sm font-normal time-text ms-4"
            style={{ color: "grey" }}
          >
            {String(userChatData.hour_part).padStart(2, "0")}:
            {String(userChatData.minute_part).padStart(2, "0")}
          </span>
        </div>
        <p className="text-sm font-normal py-2.5 message-text">
          {userChatData.messages}
        </p>
        <span className="text-sm font-normal delivered-text">Delivered</span>
      </div>
      {sendEmojiState && (
        <div className="d-flex">
          <EmojiKeyboard
            height={320}
            width={350}
            theme="dark"
            searchLabel="Procurar emoji"
            searchDisabled={false}
            onEmojiSelect={(emoji) => handleEmojiClick(emoji)}
            categoryDisabled={false}
          />{" "}
          <CloseIcon
            onClick={() => setSendEmojiState(false)}
            style={{ color: "white", fontSize: "30px" }}
          />
        </div>
      )}
      <button
        id="dropdownMenuIconButton"
        className="btn btn-sm btn-light p-2 text-sm font-weight-bold text-center text-dark rounded-lg"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <MoreVertIcon fontSize="small" style={{ color: "grey" }} />
      </button>
      <div
        id="dropdownDots"
        className="dropdown-menu dropdown-menu-end mt-2 shadow bg-light"
        aria-labelledby="dropdownMenuIconButton"
      >
        <ul className="py-2 text-sm ">
          <li>
            <a href="#" className="dropdown-item">
              Reply
            </a>
          </li>
          <li onClick={handleSendEmoji}>
            <a
              className="dropdown-item"
              onClick={(e) => {
                userChatData &&
                  userChatData.id &&
                  handleEmojiClick(e, userChatData.id);
              }}
            >
              Emoji
            </a>
          </li>
          <li>
            <a href="#" className="dropdown-item">
              Copy
            </a>
          </li>
          <li>
            <a href="#" className="dropdown-item">
              Report
            </a>
          </li>
          {userChatData.sender_id == user.id ? (
            <li>
              <a
              style={{cursor:"pointer"}}
                className="dropdown-item"
                onClick={(e) => {
                  userChatData &&
                    userChatData.id &&
                    handleDeleteMessage(e, userChatData.id);
                }}
              >
                Delete
              </a>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
}

export default UserChatDesign;
