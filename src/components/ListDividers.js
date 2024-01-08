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
  bgcolor: "#2B2D31",
  color: "white",
};

export default function ListDividers() {
  return (
    <List
      sx={style}
      component="nav"
      aria-label="mailbox folders"
      className="mt-3"
    >
      <hr className="mb-0 mt-0" />
      <ListItem button>
        <PeopleIcon className="me-2" />
        <ListItemText primary="Friends" />
      </ListItem>
      <Divider />
      <ListItem button divider>
        <WhatshotIcon className="me-2" />
        <Link
          style={{ color: "white", textDecoration: "none" }}
          to={"/joinserver"}
        >
          <ListItemText primary="servers" />
        </Link>
      </ListItem>
      <ListItem button>
        <StorefrontIcon className="me-2" />
        <ListItemText primary="shop" />
      </ListItem>
      <Divider light />
      <hr className="mt-0 mb-0" />
    </List>
  );
}
