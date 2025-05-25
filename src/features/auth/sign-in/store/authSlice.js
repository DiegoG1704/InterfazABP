import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../useCase/login.use-case";
import AxiosServices from "../../../../helper/http-common";
import { history } from "../../../../helper/history";

// Async Thunk para login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await loginUser({
        usuario: credentials?.usuario,
        contraseña: credentials?.contraseña,
      });
      return response; // Va como action.payload al fulfilled
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Error inesperado al hacer login",
        }
      );
    }
  }
);

// Estado inicial
const initialState = {
  user: null,
  success: false,
  loading: false,
  isLogged: !!localStorage.getItem("authToken"),
  authToken: localStorage.getItem("authToken"),
  RefreshToken: localStorage.getItem("RefreshToken"),
  error: null,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLogged = false;
      state.authToken = null;
      state.RefreshToken = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("authToken");
      localStorage.removeItem("RefreshToken");

      delete AxiosServices.httpInstance.defaults.headers["Authorization"];

      if (history.navigate) {
        history.navigate("/"); // o cualquier ruta que quieras
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload", action.payload);
        if (action.payload.success) {

          state.isLogged = true;
          state.authToken = action.payload.access_token;
          state.RefreshToken = action.payload.refresh_token;
          state.error = null;

          // Guardar en localStorage
          localStorage.setItem("authToken", action.payload.data.access_token);
          localStorage.setItem("RefreshToken", action.payload.data.refresh_token);

          // Actualizar token del adapter
          AxiosServices.httpInstance.defaults.headers["Authorization"] = `Bearer ${action.payload.data.access_token}`;

          // Redirección
          if (history.navigate) {
            history.navigate("/dashboard"); // ← typo corregido
          }
        } else {
          state.user = null;
          state.isLogged = false;
          state.error = action.payload.message || "Login fallido";
        }

      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isLogged = false;
        state.error = action.payload?.message || "Error inesperado";
        console.error("Login error:", state.error); // Puedes mostrar esto en toast si deseas

      });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
