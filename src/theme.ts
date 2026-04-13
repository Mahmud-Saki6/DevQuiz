import { extendTheme } from "@mui/material/styles";

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#001e4d" },
        secondary: { main: "#1d9e75" },
        background: { default: "#001e4d", paper: "#ffffff" }
      }
    },
    dark: {
      palette: {
        primary: { main: "#8ab4ff" },
        secondary: { main: "#33d0a0" },
        background: { default: "#0b1220", paper: "#0f1a33" }
      }
    }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ["Poppins", "system-ui", "Segoe UI", "Roboto", "Arial"].join(",")
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" }
      }
    }
  }
});

