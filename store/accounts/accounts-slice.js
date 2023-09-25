import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Accounts");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getInvoices: null,
  getInvoicesStatus: "idle",

};

export const getInvoices = createAsyncThunk(
    "users/getInvoices",
    async ({
      page = null,
      filter = null,
    } = {}) => {
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/accounts/invoices?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getInvoices::BEGIN");
      const response = await fetch(url, {
        headers: {
        //   Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getInvoices::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getInvoices Data
      .addCase(getInvoices.pending, (state) => {
        state.getInvoicesStatus = "loading";
      })
      .addCase(getInvoices.rejected, (state) => {
        state.getInvoicesStatus = "rejected";
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.getInvoicesStatus = "fulfilled";
        state.getInvoices = action.payload;
      });
  },
});

export default accountsSlice.reducer;
