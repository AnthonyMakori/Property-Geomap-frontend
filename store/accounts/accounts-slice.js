import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Accounts");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getInvoices: null,
  getInvoicesStatus: "idle",

  getPayments: null,
  getPaymentsStatus: "idle",

};

export const getInvoices = createAsyncThunk(
    "invoices/getInvoices",
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

  //getPayments
  export const getPayments = createAsyncThunk(
    "payments/getPayments",
    async ({
      page = null,
      filter = null,
    } = {}) => {
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/accounts/payments?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getPayments::BEGIN");
      const response = await fetch(url, {
        headers: {
        //   Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getPayments::END", { took: seconds, data });
  
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
      })

      //getPayments
      .addCase(getPayments.pending, (state) => {
        state.getPaymentsStatus = "loading";
      })
      .addCase(getPayments.rejected, (state) => {
        state.getPaymentsStatus = "rejected";
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.getPaymentsStatus = "fulfilled";
        state.getPayments = action.payload;
      });
  },
});

export default accountsSlice.reducer;
