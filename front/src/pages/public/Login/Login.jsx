import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import logo from "../../../img/logo.webp";
import useLoginHook from "./hooks/useLoginHook";

function Login() {
  const { loading, showPassword, setShowPassword, handleLogin } =
    useLoginHook();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#f8f7fa",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "45%",
          bgcolor: "#141259",
          p: 6,
          gap: 3,
        }}
      >
        {/* Logo em card branco para contrastar com o fundo escuro */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 3,
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Plantonix"
            sx={{ width: 180, height: "auto", display: "block" }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{ color: "#fff", fontWeight: 700, textAlign: "center", mt: 2 }}
        >
          Gestão de escalas simplificada
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          Organize plantões, funcionários e blocos em um único lugar.
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: 2,
          }}
        >
          {[80, 48, 64].map((size, i) => (
            <Box
              key={i}
              sx={{
                width: size,
                height: size,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 8 },
        }}
      >
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            width: 180,
            height: 60,
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            mb: 4,
          }}
        />

        <Box sx={{ width: "100%", maxWidth: 420 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#141259", mb: 0.5 }}
          >
            Bem-vindo de volta
          </Typography>
          <Typography variant="body2" sx={{ color: "#707070", mb: 4 }}>
            Faça login para acessar o sistema
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label="E-mail"
              name="email"
              type="email"
              fullWidth
              required
              autoComplete="email"
              size="medium"
              sx={sxTextField}
            />

            <TextField
              label="Senha"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              autoComplete="current-password"
              size="medium"
              sx={sxTextField}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon sx={{ color: "#707070" }} />
                        ) : (
                          <VisibilityIcon sx={{ color: "#707070" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                bgcolor: "#141259",
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 15,
                textTransform: "none",
                "&:hover": { bgcolor: "#0d0c40" },
                "&.Mui-disabled": { bgcolor: "#141259", opacity: 0.6 },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Entrar"
              )}
            </Button>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: "#787878", mt: 6 }}>
          Plantonix © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}

const sxTextField = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&.Mui-focused fieldset": { borderColor: "#141259" },
  },
  "& label.Mui-focused": { color: "#141259" },
};

export default Login;
