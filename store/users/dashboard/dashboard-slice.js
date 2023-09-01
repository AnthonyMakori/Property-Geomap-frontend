import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getDashboard: null,
  getDashboardStatus: "idle",

};

export const getDashboard = createAsyncThunk(
  "dashboard/getDashboard",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/dashboard?`;

    const params = {};

    url += new URLSearchParams(params);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Dashboard Data
      .addCase(getDashboard.pending, (state) => {
        state.getDashboardStatus = "loading";
      })
      .addCase(getDashboard.rejected, (state) => {
        state.getDashboardStatus = "rejected";
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.getDashboardStatus = "fulfilled";
        state.getDashboard = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
