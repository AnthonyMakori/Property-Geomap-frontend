import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Communications");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getCommunications: null,
  getCommunicationsStatus: "idle",

  getAirtimeBalance: null,
  getAirtimeBalanceStatus: "idle",

};

export const getCommunications = createAsyncThunk(
    "communications/getCommunications",
    async ({
      page = null,
      filter = null,
      accessToken = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/communications/index?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getCommunications::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getCommunications::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  export const getAirtimeBalance = createAsyncThunk(
    "communications/getAirtimeBalance",
    async ({
      page = null,
      filter = null,
      accessToken = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/communications/airtime?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getAirtimeBalance::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getAirtimeBalance::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


const communicationsSlice = createSlice({
  name: "communications",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Tenants Data
      .addCase(getCommunications.pending, (state) => {
        state.getCommunicationsStatus = "loading";
      })
      .addCase(getCommunications.rejected, (state) => {
        state.getCommunicationsStatus = "rejected";
      })
      .addCase(getCommunications.fulfilled, (state, action) => {
        state.getCommunicationsStatus = "fulfilled";
        state.getCommunications = action.payload;
      })

      //getAirtimeBalance
      .addCase(getAirtimeBalance.pending, (state) => {
        state.getAirtimeBalanceStatus = "loading";
      })
      .addCase(getAirtimeBalance.rejected, (state) => {
        state.getAirtimeBalanceStatus = "rejected";
      })
      .addCase(getAirtimeBalance.fulfilled, (state, action) => {
        state.getAirtimeBalanceStatus = "fulfilled";
        state.getAirtimeBalance = action.payload;
      })
      ;
  },
});

export default communicationsSlice.reducer;
