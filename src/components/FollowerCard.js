import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PeopleIcon from "@mui/icons-material/People";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Link } from "react-router-dom";

const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "#313338",
  color: "white",
};

function FollowerCard({ ufollower }) {
  return (
    <List sx={style} component="nav" aria-label="mailbox folders">
      <Link
        style={{ color: "white", textDecoration: "none" }}
        to={`/user/${ufollower.id}`}
      >
        <ListItem button>
          <ListItemText primary={ufollower.discordUsername} />
        </ListItem>
      </Link>
    </List>
  );
}

export default FollowerCard;
