import React, { useEffect, useState } from "react";
import "../styles/SearchFriends.css";
import axios from "axios";
import { useLocalStorage } from "@uidotdev/usehooks";

function SearchFriends({ searchFriendData, allFriendsData }) {
  const [user, setUser] = useLocalStorage("user");

  const handleAddFriends = (e, searchFriendId) => {
    e.preventDefault();

    if (searchFriendId !== undefined) {
      axios
        .get(
          `http://localhost/php-full-project/php-project/api/api.php?action=add_friends&follower=${user.id}&followed=${searchFriendId}`
        )
        .then((res) => console.log(res.data));
      window.location.reload(true);
    }
  };

  return (
    <div className="friendsCardSearch d-flex justify-content-between align-items-center">
      <div
        className="card mt-3"
        style={{ backgroundColor: "#ccc", width: "80%" }}
      >
        <div className="card-body">{searchFriendData.email}</div>
      </div>
      <form>
        <button
          className="btn btn-sm btn-outline-success mt-3 ms-2"
          style={{ height: "40px", width: "100%" }}
          onClick={(e) => handleAddFriends(e, searchFriendData.id)}
        >
          {allFriendsData.some((friend) => friend.id === searchFriendData.id)
            ? "unFollow"
            : "Follow"}
        </button>
      </form>
    </div>
  );
}

export default SearchFriends;
