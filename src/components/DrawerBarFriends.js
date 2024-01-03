import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function TemporaryDrawer() {
  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ left: open });
  };

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {[
          { text: "Inbox", icon: <InboxIcon />, link: "/inbox" },
          { text: "Starred", icon: <MailIcon />, link: "/starred" },
          { text: "Send email", icon: <InboxIcon />, link: "/send-email" },
          { text: "Drafts", icon: <MailIcon />, link: "/drafts" },
        ].map((item, index) => (
          <Link
            to={item.link}
            key={item.text}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {[
          { text: "All mail", icon: <InboxIcon />, link: "/all-mail" },
          { text: "Trash", icon: <MailIcon />, link: "/trash" },
          { text: "Spam", icon: <InboxIcon />, link: "/spam" },
        ].map((item, index) => (
          <Link
            to={item.link}
            key={item.text}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Open Left</Button>
      <Drawer anchor="left" open={state.left} onClose={toggleDrawer(false)}>
        {list}
      </Drawer>
    </div>
  );
}
