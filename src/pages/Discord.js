import React, { useEffect, useState } from "react";
import "../styles/Discord.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocalStorage } from "@uidotdev/usehooks";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
//modali
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
//me create server button
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
//emri serverit anash ne te djatht
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";

//dashboard per proflilin loguot
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
//search component
import { alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ListDividers from "../components/ListDividers";
import FollowerCard from "../components/FollowerCard";
import { useParams } from "react-router-dom";

import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

//search style
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Discord() {
  const navigate = useNavigate();

  //modali
  const [opens, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloses = () => setOpen(false);
  //Dashboard

  const [servers, setServers] = useState([]);
  const [user, setUser] = useLocalStorage("user");
  const [createServer, setCreateServer] = useState({});
  const [userServer, setUserServer] = useState([]);

  //followers and followed
  const [userFollower, setUserFollower] = useState([]);
  // const handleFollowAndUnFollow = (e) => {
  //   useEffect(() => {
  //     axios
  //       .get(
  //         `http://localhost/php-full-project/php-project/api/api.php?action=add_friends&follower=${user.id}&followed=26`
  //       )
  //       .then((response) => console.log(response.data));
  //   }, []);
  // };

  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_user_servers&id=${user.id}`
      )
      .then((response) => setServers(response.data.servers));
  }, [createServer]);
  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_user_followers&id=${user.id}`
      )
      .then((res) => setUserFollower(res.data.followers));
  }, []);

  const handleCreateServer = (e) => {
    e.preventDefault();
    const elements = e.target.elements;
    setCreateServer({
      action: "server_create",
      user_id: user.id,
      name: elements["name"].value,
    });
  };

  useEffect(() => {
    if (createServer?.action) {
      axios
        .post(
          "http://localhost/php-full-project/php-project/api/api.php",
          createServer
        )
        .then((response) => {
          if (response.data.status === 1) {
            window.location.reload(true);
          }
        })
        .catch((error) => alert(error));
    }
  }, [createServer]);

  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_user_servers&id=${user.id}`
      )
      .then((res) => setUserServer(res.data.servers));
  }, [createServer]);
  if (user == null) {
    navigate("/");
  }
  //get servers id im in
  const [serversIdImIn, setServersIdImIn] = useState([]);
  const [serversImInDetails, setServersImInDetails] = useState();
  //per tabelen

  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_servers_id_im_in&id=${user.id}`
      )
      .then((res) => {
        const serverIds = res.data.servers.map((server) => server.server_id);
        setServersIdImIn(serverIds);

        const fetchServersDetails = serverIds.map((serverId) =>
          axios.get(
            `http://localhost/php-full-project/php-project/api/api.php?action=get_servers_im_in&id=${serverId}`
          )
        );

        Promise.all(fetchServersDetails)
          .then((serverDetailsResponses) => {
            const serversDetails = serverDetailsResponses.map(
              (response) => response.data.servers
            );
            setServersImInDetails(serversDetails);
          })
          .catch((error) => {
            console.error("Error fetching server details:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching server IDs:", error);
      });
  }, [user.id]);

  const [allFriends, setAllFriends] = useState();
  const [handleAllFriends, SetHandleAllFriends] = useState(false);

  const handleClickAllFriends = (e) => {
    e.preventDefault();
    SetHandleAllFriends(!handleAllFriends);
    if (handleAllFriends) {
      axios
        .get(
          `http://localhost/php-full-project/php-project/api/api.php?action=get_user_followers&id=${user.id}`
        )
        .then((res) => setAllFriends(res.data.followers));
    } else {
      setAllFriends(null);
    }
  };

  const [anchor, setAnchor] = React.useState(null);
  const ope = Boolean(anchor);
  const handleClicksss = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleClosesss = () => {
    setAnchor(null);
  };
  return (
    <div className="DiscordContainer d-flex ">
      <div className="ServerDiv col-1 d-flex flex-direction-column justify-content-center ">
        <div className="profileDiv">
          <div className="d-flex justify-content-center">
            <React.Fragment>
              <Box
                className="d-flex justify-content-center"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClicksss}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={ope ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={ope ? "true" : undefined}
                  >
                    <Avatar
                      className="mt-2 me-2"
                      sx={{ width: 52, height: 52 }}
                    >
                      <h1>{user?.discordUsername.charAt(0)}</h1>
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchor}
                id="account-menu"
                open={ope}
                onClose={handleClosesss}
                onClick={handleClosesss}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 163,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleClosesss}>
                  <Avatar /> {user?.discordUsername}
                </MenuItem>
                <MenuItem onClick={handleClosesss}>
                  <Avatar /> {user?.email}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClosesss}>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  Add another account
                </MenuItem>
                <MenuItem onClick={handleClosesss}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={() => setUser(null)}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </React.Fragment>
          </div>
          <hr style={{ color: "white" }} />
          <div className="servers">
            {userServer?.length > 0 &&
              userServer.map((uServer) => (
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/server/${uServer.id}`}
                >
                  <Box sx={{ width: 500 }}>
                    <Grid container justifyContent="center">
                      <Grid item style={{ width: "60px" }}>
                        <Tooltip title={uServer.name} placement="right-start">
                          <div
                            key={uServer.id}
                            style={{
                              height: "60px",
                              width: "100%",
                              borderRadius: "50%",
                              color: "white",
                              cursor: "pointer",
                              backgroundColor: "#313338",
                              // backgroundImage: `url(${uServer.image})`,// duhet me kshhyr qysh me vnu foton
                            }}
                            className="mb-2 d-flex align-items-center justify-content-center"
                          >
                            <h1>{uServer.name.charAt(0)}</h1>
                          </div>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Box>
                </Link>
              ))}
            {serversImInDetails?.length > 0 &&
              serversImInDetails.map((serverImInDetail, index) => (
                <div key={index}>
                  {serverImInDetail.map((server, serverIndex) => (
                    <div key={serverIndex}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/server/${server.id}`}
                      >
                        <Box sx={{ width: 500 }}>
                          <Grid container justifyContent="center">
                            <Grid item style={{ width: "60px" }}>
                              <Tooltip
                                title={server.name}
                                placement="right-start"
                              >
                                <div
                                  key={server.id}
                                  style={{
                                    height: "60px",
                                    width: "100%",
                                    borderRadius: "50%",
                                    color: "white",
                                    cursor: "pointer",
                                    backgroundColor: "#313338",
                                    // backgroundImage: `url(${uServer.image})`,// duhet me kshhyr qysh me vnu foton
                                  }}
                                  className="mb-2 d-flex align-items-center justify-content-center"
                                >
                                  <h1>{server.name.charAt(0)}</h1>
                                </div>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Box>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <div style={{ color: "white" }} className="createServer">
            <div className="d-flex justify-content-center">
              <Box
                sx={{
                  "& > :not(style)": { mt: 1, backgroundColor: "#1E1F22" },
                }}
              >
                <Fab color="secondary" aria-label="add" onClick={handleOpen}>
                  <AddIcon />
                </Fab>
              </Box>
            </div>
            <div>
              {/* <Button>Open modal</Button> */}
              <Modal
                open={opens}
                onClose={handleCloses}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  className="d-flex justify-content-center align-items-center"
                  sx={style}
                  style={{ backgroundColor: "#313338", color: "white" }}
                >
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Typography
                      className="text-center mb-4"
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Create your Server
                    </Typography>
                    <form
                      method="POST"
                      encType="multipart/form-data"
                      onSubmit={handleCreateServer}
                    >
                      <div className="container w-40">
                        <div className="d-flex justify-content-center align-items-center mb-3">
                          <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                          >
                            Upload Photo
                            <VisuallyHiddenInput type="file" name="images" />
                          </Button>
                        </div>
                        <div className="d-flex  ">
                          <input
                            className="form-control mt-2"
                            type="text"
                            placeholder="Write Server's name"
                            aria-label="default input example"
                            name="name"
                            required
                          />
                          <button
                            type="submit"
                            className="btn btn-sm btn-primary mt-2 ms-2"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </form>
                  </Typography>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "#2B2D31" }} className="FriendsDiv col-2">
        <div
          className="inputSearch d-flex flex-direction-column justify-content-center align-items-center"
          style={{ color: "white" }}
        >
          <form>
            <Search className="mt-4">
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </form>
        </div>

        <ListDividers />
        <div className="firends">
          {userFollower?.length > 0 &&
            userFollower.map((ufollower) => (
              <FollowerCard ufollower={ufollower} />
            ))}
        </div>
      </div>
      <div
        style={{ backgroundColor: "#313338", color: "white" }}
        className="MainContent col-7"
      >
        <div className="navbar ">
          <div className="d-flex justify-content-center align-items-center">
            <Box
              className="d-flex flex-drection-row ms-4"
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            >
              <Button
                onClick={handleClickAllFriends}
                className="me-2"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                All
              </Button>
              <Button
                className="me-2"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Online
              </Button>

              <button
                style={{ height: "30px" }}
                className="btn btn-sm btn-outline-success mt-3 ms-2"
              >
                Add friend
              </button>
            </Box>
          </div>
        </div>
        <hr className="mt-0 mb-0" />

        <div className="friends">
          <table className="table table-primary FriendsTable ">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name Surname</th>
                <th scope="col">Email</th>
                <th scope="col">Discord Username</th>
              </tr>
            </thead>
            <tbody>
              {allFriends?.length > 0 &&
                allFriends.map((allfriend, index) => (
                  <tr key={index}>
                    <th scope="row">{allfriend.id}</th>
                    <td>{allfriend.name}</td>
                    <td>{allfriend.email}</td>
                    <td>{allfriend.discordUsername}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        style={{ backgroundColor: "#2B2D31", color: "white" }}
        className="rightContent col-2"
      >
        123
      </div>
    </div>
  );
}

export default Discord;
