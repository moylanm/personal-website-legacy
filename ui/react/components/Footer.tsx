import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        bottom: 0,
        width: "100%",
        position: "fixed",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? "#1976d2"
            : "#282828",
      }}
    >
      <Container>
        <Typography variant="body2" color="text.secondary" align="center">
            {"Powered by "}
          <Link color="inherit" href="https://go.dev/">
            Go
          </Link>
          {" and "}
          <Link color="inherit" href="https://react.dev/">
            React
          </Link>{" in "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
