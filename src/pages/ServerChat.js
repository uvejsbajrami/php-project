import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/ServerChat.css";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
//emri serverit anash ne te djatht
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useLocalStorage } from "@uidotdev/usehooks";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatDesign from "../components/ChatDesign";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

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

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function ServerChat() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [opens, setOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleOpen = () => setOpen(true);
  const handleCloses = () => setOpen(false);

  const { id } = useParams();
  // const { channelId } = useParams();
  const [server, setServer] = useState(); // marrja e nje serveri
  const [userInServer, setUserInServer] = useState([]); // userat qe jan ne at server
  const [user, setUser] = useLocalStorage("user"); //useri i logum
  const [createServer, setCreateServer] = useState({}); // serverat e krijum
  const [userServer, setUserServer] = useState([]); // userat qe jan ne servera
  const [serverOwner, setServerOwner] = useState([]); // kirjusi i serverit
  const [ownerID, setOwnerID] = useState(); // marrja e ids se Krijusit te serverit

  const handleCreateServer = (e) => {
    e.preventDefault();
    const elements = e.target.elements;
    setCreateServer({
      action: "server_create",
      user_id: user.id,
      name: elements["name"].value,
      image: elements["images"].value,
    });
  }; // marrja e te dhanave per krijimin e serverit

  useEffect(() => {
    if (createServer?.action) {
      axios
        .post(
          "http://localhost/php-full-project/php-project/api/api.php",
          createServer
        )
        .then((response) => {
          console.log(response?.data);
        })
        .catch((error) => alert(error));
    }
  }, [createServer]); // kirjimi me api POST te serverit

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //te emri serverit option
  const [anchorEls, setAnchorEls] = React.useState(null);
  const opena = Boolean(anchorEls);
  const handleClicks = (event) => {
    setAnchorEls(event.currentTarget);
  };
  const handleClosess = () => {
    setAnchorEls(null);
  };
  const handleLeave = (e) => {
    e.preventDefault();
    if (user.id !== ownerID) {
      axios
        .get(
          `http://localhost/php-full-project/php-project/api/api.php?action=leave_server&id=${user.id}&server_id=${id}`
        )
        .then((res) => console.log(res?.data));
      navigate("/discord");
    } else {
      axios
        .get(
          `http://localhost/php-full-project/php-project/api/api.php?action=leave_owner_server&server_id=${id}&user_id=${user.id}`
        )
        .then((res) => console.log(res?.data));
      navigate("/discord");
    }
  }; // Dalja nga serveri

  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_server&id=${id}`
      )
      .then((res) => setServer(res?.data?.server));
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_user_in_server&id=${id}`
      )
      .then((res) => setUserInServer(res?.data?.users));
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_servers_owner&server_id=${id}`
      )
      .then((res) => {
        // Assuming response data is an array of users
        if (Array.isArray(res?.data?.users) && res.data?.users?.length > 0) {
          // Set the serverOwner state to the array of users
          setServerOwner(res?.data?.users);

          // Accessing user_id from the first user object in the array
          const firstUser = res?.data?.users[0];
          const firstUserId = firstUser.user_id;
          setOwnerID(firstUserId);
          console.log("First User ID:", firstUserId);
        }
      })
      .catch((error) => {
        console.error("Error fetching server owner:", error);
      });
  }, [id]); // marrja e serverit | marrja e userave qe jan ne server | marrja e krijusit te serverit me API

  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_user_servers&id=${user.id}`
      )
      .then((res) => setUserServer(res?.data?.servers));
  }, [createServer]);
  if (user == null) {
    navigate("/");
  }

  const [serversIdImIn, setServersIdImIn] = useState([]); // ID e serverit qe jam ne te
  const [serversImInDetails, setServersImInDetails] = useState([]); // details te serverave qe jam aty

  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_servers_id_im_in&id=${user.id}`
      )
      .then((res) => {
        const serverIds = res?.data?.servers?.map(
          (server) => server?.server_id
        );
        setServersIdImIn(serverIds);

        // Fetch details for each server
        const fetchServersDetails = serverIds?.map((serverId) =>
          axios.get(
            `http://localhost/php-full-project/php-project/api/api.php?action=get_servers_im_in&id=${serverId}`
          )
        );

        Promise.all(fetchServersDetails)
          .then((serverDetailsResponses) => {
            const serversDetails = serverDetailsResponses?.map(
              (response) => response?.data?.servers
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

  //get owner of sever

  const [anchor, setAnchor] = React.useState(null);
  const ope = Boolean(anchor);
  const handleClicksss = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleClosesss = () => {
    setAnchor(null);
  };

  const [serverChannel, setServerChannel] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=get_server_channels&id=${id}`
      )
      .then((res) => setServerChannel(res?.data?.channels));
  }, [serverChannel]); // marrja e channelave te serverit

  const [openss, setOpenss] = React.useState(false);
  const handleOpens = () => setOpenss(true);
  const handleClos = () => setOpenss(false);

  const [channel, setChannel] = useState({});

  const handleCreateChannel = (e) => {
    e.preventDefault();
    const elements = e.target.elements;
    const newChannel = {
      action: "channel_create",
      server_id: id,
      name: elements["name"].value,
    };

    setChannel(newChannel);
    axios
      .post(
        "http://localhost/php-full-project/php-project/api/api.php",
        newChannel
      )
      .then((res) => {
        if (res?.data?.status === 1) {
          window.location.reload(true);
        }
      })
      .catch((error) => console.error("Error creating channel:", error));
  }; //krijimi i channelit

  const [takeChannelId, setTakeChannelId] = useState(); // marrja e channelID

  const [serverMessages, setServerMessages] = useState([]);
  const [newMessageTrigger, setNewMessageTrigger] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendServerMessage = async (e) => {
    e.preventDefault();
    const elements = e.target.elements;
    const newServerMessage = {
      action: "send_server_message",
      sender_id: user.id,
      server_id: id,
      channel_id: takeChannelId,
      message: elements["message"].value,
    };
    setMessage("");
    try {
      await axios.post(
        "http://localhost/php-full-project/php-project/api/api.php",
        newServerMessage
      );
      setNewMessageTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };
  useEffect(() => {
    if (takeChannelId !== undefined && id !== undefined) {
      axios
        .get(
          `http://localhost/php-full-project/php-project/api/api.php?action=get_server_messages&server_id=${id}&channel_id=${takeChannelId}`
        )
        .then((res) => {
          setServerMessages(res?.data?.server_messages);
        })
        .catch((error) => {
          console.error("Error fetching server messages:", error);
        });
    }
  }, [takeChannelId, id, newMessageTrigger]);

  const handleDeleteChannel = (e, channelId) => {
    e.preventDefault();
    axios
      .get(
        `http://localhost/php-full-project/php-project/api/api.php?action=delete_channel&channel_id=${channelId}&server_id=${id}`
      )
      .then((res) => console.log(res?.data));
    window.location.reload(true);
  };
  return (
    <div className="serverChat d-flex ">
      <div
        style={{ backgroundColor: "#1E1F22" }}
        className="servers col-1 d-flex flex-direction-column justify-content-center"
      >
        <div className="profileDiv">
          <div className="d-flex justify-content-center">
            <Link to={"/discord"}>
              <Button
                id="demo-positioned-button"
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                style={{ color: "white" }}
              >
                <AccountCircleIcon
                  style={{ fontSize: "50px" }}
                  className="profileicon mt-2"
                />
              </Button>
            </Link>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={() => setUser(null)}>Logout</MenuItem>
            </Menu>
          </div>
          <hr style={{ color: "white", width: "63%" }} />
          <div className="servers">
            {userServer?.length > 0 &&
              userServer?.map((uServer) => (
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
              serversImInDetails?.map((serverImInDetail, index) => (
                <div key={index}>
                  {serverImInDetail?.map((server, serverIndex) => (
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

      <div style={{ backgroundColor: "#35373C" }} className="channels col-2">
        <div className="serverName ">
          <div className="d-flex justify-content-center mt-4 mb-2">
            <Button
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#35373C",
              }}
              id="demo-customized-button"
              aria-controls={opena ? "demo-customized-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={opena ? "true" : undefined}
              variant="contained"
              disableElevation
              onClick={handleClicks}
              endIcon={<KeyboardArrowDownIcon />}
            >
              {server?.name}
            </Button>
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button",
              }}
              anchorEl={anchorEls}
              open={opena}
              onClose={handleClosess}
            >
              <MenuItem onClick={handleLeave} disableRipple>
                <LogoutIcon />
                Leave Server
              </MenuItem>
            </StyledMenu>
          </div>
          <hr className="mt-0 mb-0" style={{ color: "black" }} />
        </div>
        <div className="serverChannels">
          <div className="mb-0 pb-0 createChannel d-flex justify-content-between">
            {user?.id == ownerID ? (
              <>
                <h5 className="ms-2 mt-1 " style={{ color: "grey" }}>
                  {" "}
                  Create Channel{" "}
                </h5>
                <AddIcon
                  className="me-2 mt-1"
                  style={{ color: "grey", cursor: "pointer" }}
                  onClick={handleOpens}
                />
              </>
            ) : (
              <></>
            )}
            <Modal
              open={openss}
              onClose={handleClos}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={style}
                style={{ backgroundColor: "#313338", color: "white" }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  className="text-center"
                >
                  Create Channel
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <form
                    method="POST"
                    className="d-flex"
                    onSubmit={handleCreateChannel}
                  >
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      aria-label="readonly input example"
                      placeholder="Write channels name"
                      readonly
                    />
                    <button
                      type="submit"
                      className="btn btn-sm btn-outline-success ms-3"
                    >
                      Submit
                    </button>
                  </form>
                </Typography>
              </Box>
            </Modal>
          </div>
          <Accordion
            className="mt-1"
            style={{ backgroundColor: "#2B2D31", color: "white" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Channels</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {serverChannel?.length > 0 ? (
                serverChannel?.map((serverChannels, index) => (
                  <Typography key={index}>
                    <div className="d-flex justify-content-between">
                      {" "}
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => setTakeChannelId(serverChannels.id)}
                      >
                        {serverChannels?.name}{" "}
                      </p>
                      {user?.id == ownerID ? (
                        <Tooltip
                          title="Delete channel"
                          className="d-flex justify-content-center"
                        >
                          <IconButton>
                            <DeleteIcon
                              style={{ color: "#EE3939" }}
                              onClick={(e) =>
                                handleDeleteChannel(e, serverChannels.id)
                              }
                            />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Typography>
                ))
              ) : (
                <Typography>No channels available</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>

      <div
        style={{ backgroundColor: "#313338" }}
        className=" d-flex flex-column justify-content-between col-7"
      >
        <div className="chat">
          {serverMessages?.length > 0 &&
            serverMessages?.map((serverMessage) => (
              <ChatDesign
                serverDataChat={serverMessage}
                ownerId={ownerID}
                usersInServer={userInServer}
              />
            ))}
        </div>
        <div className="mb-2 inputForm" id="inputForm">
          <form method="POST" onSubmit={handleSendServerMessage}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                style={{ backgroundColor: "#424548", color: "white" }}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: "#7289da", borderColor: "#7289da" }}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ backgroundColor: "#2B2D31" }} className="usersServer col-2">
        <Accordion
          className="mt-4"
          style={{ backgroundColor: "#2B2D31", color: "white" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Owner</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {serverOwner?.length > 0 &&
              serverOwner?.map((owner, index) => (
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  key={index}
                >
                  <Typography>
                    <h5 className="">
                      {owner?.discordUsername}{" "}
                      <VerifiedUserOutlinedIcon fontSize="small" />
                    </h5>
                  </Typography>
                </Link>
              ))}
          </AccordionDetails>
        </Accordion>
        <Accordion
          style={{ backgroundColor: "#2B2D31", color: "white" }}
          className="mt-3"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Memebers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {userInServer?.length > 0 &&
              userInServer?.map((uServer, index) => (
                <Link
                  to={`/user/${uServer.users_id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Typography key={index}>
                    <h5 className="mt-4">{uServer?.discordUsername} </h5>
                  </Typography>
                </Link>
              ))}
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}

export default ServerChat;
