import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

export default function DescriptionAlerts() {
  return (
    <Stack sx={{ width: "100%" }} className="mb-3" spacing={2}>
      <Alert severity="success" style={{ backgroundColor: "#0C130D" }}>
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
      </Alert>
    </Stack>
  );
}
