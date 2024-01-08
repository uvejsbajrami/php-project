import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import "../styles/JoinServer.css";
import AvatarGroup from "@mui/joy/AvatarGroup";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import "@fontsource/inter";
import { useTheme } from "@mui/system";
import { ThemeProvider } from "@mui/material/styles";
import axios, { Axios } from "axios";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function JoinServer() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [getAllServers, setGetAllServers] = useState([]);
  const [getAllUsers, setGetAllUsers] = useState([]);
  const [getUserInServer, setGetUserInServer] = useState([]);
  const [user, setUser] = useLocalStorage("user");
  const [joinedUsers, setJoinedUsers] = useState([]); //useri i logum
  const [usersInServersWithId, setUsersInServersWithId] = useState([]);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  useEffect(() => {
    axios
      .get(
        "http://localhost/php-full-project/php-project/api/api.php?action=get_all_servers"
      )
      .then((res) => setGetAllServers(res.data.all_servers));
  }, []);
  useEffect(() => {
    axios
      .get(
        "http://localhost/php-full-project/php-project/api/api.php?action=get_all_users"
      )
      .then((res) => setGetAllUsers(res.data.all_users));
  }, []);
  useEffect(() => {
    axios
      .get(
        "http://localhost/php-full-project/php-project/api/api.php?action=get_all_user_in_server"
      )
      .then((res) => setGetUserInServer(res.data.users));
  }, []);
  console.log(getUserInServer);

  const handleJoinServer = (e, serverId) => {
    e.preventDefault();
    const joinServer = {
      action: "join_server",
      users_id: user.id,
      server_id: serverId,
    };
    if (serverId !== undefined) {
      axios
        .post(
          "http://localhost/php-full-project/php-project/api/api.php",
          joinServer
        )
        .then((res) => {
          if (res.data.status === 1) {
            navigate("/discord");
          }
        });
    }
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_user_in_server_with_id&id=${user.id}`
      )
      .then((res) => setUsersInServersWithId(res.data.users_in_server));
  }, []);

  return (
    <div className="JoinServerContent">
      <div className="container">
        <AppBar position="static" style={{ backgroundColor: "#1E1F22" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/discord"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Discord
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                LOGO
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </div>
      <div className="container d-flex flex-direction-row">
        <div className="row">
          {getAllServers?.length > 0 &&
            getAllServers.map((allservers) => {
              const matchingUser = getAllUsers.find(
                (user) => user.id === allservers.user_id
              );

              return (
                <Card
                  variant="outlined"
                  className="cardContainer mt-2 ms-2"
                  style={{ backgroundColor: "#1E1F22", color: "white" }}
                >
                  <Box className="flexContainer">
                    <Avatar src="/static/images/avatar/1.jpg" size="lg" />
                    <AvatarGroup
                      size="sm"
                      style={{ "--Avatar-size": "18px" }}
                      className="row"
                    >
                      <Avatar
                        src="/static/images/avatar/2.jpg"
                        sx={{ width: 24, height: 24 }}
                      />
                      <Avatar
                        src="/static/images/avatar/3.jpg"
                        sx={{ width: 24, height: 24 }}
                      />
                      <Avatar
                        src="/static/images/avatar/4.jpg"
                        sx={{ width: 24, height: 24 }}
                      />
                      <Avatar sx={{ width: 24, height: 24 }}>
                        <span style={{ fontSize: "12px" }}>+4K</span>
                      </Avatar>
                    </AvatarGroup>
                  </Box>
                  <CardContent>
                    <Typography level="title-lg">
                      Owner: {matchingUser ? matchingUser.discordUsername : ""}
                    </Typography>
                    <Typography level="body-sm">
                      ServerName: {allservers.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <form>
                      <button
                        className="btn btn-outline-primary"
                        onClick={(e) => handleJoinServer(e, allservers.id)}
                        disabled={
                          usersInServersWithId &&
                          usersInServersWithId.length > 0 &&
                          usersInServersWithId.some(
                            (user) => user.server_id === allservers.id
                          )
                        }
                      >
                        {" "}
                        {usersInServersWithId &&
                        usersInServersWithId.length > 0 &&
                        usersInServersWithId.some(
                          (user) => user.server_id === allservers.id
                        )
                          ? "Joined"
                          : "Join"}
                      </button>
                    </form>
                  </CardActions>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default JoinServer;
