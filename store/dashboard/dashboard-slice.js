import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Dashboard");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getDashboard: null,
  getDashboardStatus: "idle",

};

export const getDashboard = createAsyncThunk(
    "dashboard/getDashboard",
    async ({
      page = null,
      filter = null,
      accessToken = null,
      startDate = null,
      endDate = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/dashboard/index?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }

      if (startDate) {
        params["start_date"] = startDate;
      }
      if (endDate) {
        params["end_date"] = endDate;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getDashboard::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getDashboard::END", { took: seconds, data });
  
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
      // Tenants Data
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
