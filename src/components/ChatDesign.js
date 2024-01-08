import React, { useEffect, useRef, useState } from "react";
import "../styles/ChatDesign.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLocalStorage } from "@uidotdev/usehooks";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import axios from "axios";

function ChatDesign({ serverDataChat, ownerId, usersInServer }) {
  const [user, setUser] = useLocalStorage("user");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [serverDataChat]);

  const handleDeleteMessage = (e, messageID) => {
    e.preventDefault();
    console.log(messageID);
    if (messageID !== undefined) {
      axios
        .get(
          `http://localhost/php-full-project/php-project/api/api.php?action=delete_server_message&id=${messageID}`
        )
        .then((res) => console.log(res.data));
      window.location.reload(true);
    }
  };

  return (
    <div className="d-flex align-items-start gap-3 m-4" ref={bottomRef}>
      <div className="chat-div">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold name-text">
            UserId:{" "}
            {serverDataChat.sender_id === ownerId ? (
              <React.Fragment>
                {serverDataChat.sender_id}
                <VerifiedUserOutlinedIcon
                  fontSize="small"
                  className="ms-2 mb-1"
                />
              </React.Fragment>
            ) : (
              serverDataChat.sender_id
            )}
          </span>
          <span
            className="text-sm font-normal time-text ms-4"
            style={{ color: "grey" }}
          >
            {String(serverDataChat.hour_part).padStart(2, "0")}:
            {String(serverDataChat.minute_part).padStart(2, "0")}
          </span>
        </div>
        <p className="text-sm font-normal py-2.5 message-text">
          {serverDataChat.message}
        </p>
        <span className="text-sm font-normal delivered-text">Delivered</span>
      </div>

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
          <li>
            <a className="dropdown-item">Emoji</a>
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

          {user.id == ownerId ? (
            <li>
              <a
                style={{ cursor: "pointer" }}
                className="dropdown-item"
                onClick={(e) => {
                  serverDataChat &&
                    serverDataChat.id &&
                    handleDeleteMessage(e, serverDataChat.id);
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

export default ChatDesign;
