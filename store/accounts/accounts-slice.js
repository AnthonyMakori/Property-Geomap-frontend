import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Accounts");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getInvoices: null,
  getInvoicesStatus: "idle",

  getPayments: null,
  getPaymentsStatus: "idle",

  getExpenses: null,
  getExpensesStatus: "idle",

  getPurchases: null,
  getPurchasesStatus: "idle",

  getExpenseTypes: null,
  getExpenseTypesStatus: "idle",

  getBills: null,
  getBillsStatus: "idle",

};

export const getInvoices = createAsyncThunk(
    "invoices/getInvoices",
    async ({
      page = null,
      filter = null,
      accessToken = null,
      status = null,
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
        url = `${API_URL}/accounts/invoices?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }

      if (status) {
        params["status"] = status;
      }

      if (startDate) {
        params["start_date"] = startDate;
      }
      if (endDate) {
        params["end_date"] = endDate;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getInvoices::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
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

  //getBills
  export const getBills = createAsyncThunk(
    "bills/getBills",
    async ({
      page = null,
      filter = null,
      accessToken = null,
      unitId = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/units/bills/${unitId}?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getBills::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getBills::END", { took: seconds, data });
  
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
      accessToken = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
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
          Authorization: `Bearer ${accessToken} `,
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

  //getExpenseTypes
  export const getExpenseTypes = createAsyncThunk(
    "expenses/getExpenseTypes",
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
        url = `${API_URL}/accounts/expense-types?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getExpenseTypes::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getExpenseTypes::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getPurchases
  export const getPurchases = createAsyncThunk(
    "purchases/getPurchases",
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
        url = `${API_URL}/purchases/index?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getPurchases::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getPurchases::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

    //getExpenses
    export const getExpenses = createAsyncThunk(
      "expenses/getExpenses",
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
          url = `${API_URL}/accounts/expenses?`;
        }
    
        const params = {};
  
        if (filter) {
          params["filter"] = filter;
        }
    
        url += new URLSearchParams(params);
    
        const startTime = new Date();
        logger.log("getExpenses::BEGIN");
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken} `,
            Accept: "application/json",
          },
        }).then(async (response) => {
          const data = await response.json();
          const endTime = new Date();
          const seconds = endTime.getTime() - startTime.getTime();
          logger.log("getExpenses::END", { took: seconds, data });
    
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
      })

      //getBills
      .addCase(getBills.pending, (state) => {
        state.getBillsStatus = "loading";
      })
      .addCase(getBills.rejected, (state) => {
        state.getBillsStatus = "rejected";
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.getBillsStatus = "fulfilled";
        state.getBills = action.payload;
      })

      //getExpenses
      .addCase(getExpenses.pending, (state) => {
        state.getExpensesStatus = "loading";
      })
      .addCase(getExpenses.rejected, (state) => {
        state.getExpensesStatus = "rejected";
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.getExpensesStatus = "fulfilled";
        state.getExpenses = action.payload;
      })
      //getPurchases
      .addCase(getPurchases.pending, (state) => {
        state.getPurchasesStatus = "loading";
      })
      .addCase(getPurchases.rejected, (state) => {
        state.getPurchasesStatus = "rejected";
      })
      .addCase(getPurchases.fulfilled, (state, action) => {
        state.getPurchasesStatus = "fulfilled";
        state.getPurchases = action.payload;
      })
      //getExpenseTypes
      .addCase(getExpenseTypes.pending, (state) => {
        state.getExpenseTypesStatus = "loading";
      })
      .addCase(getExpenseTypes.rejected, (state) => {
        state.getExpenseTypesStatus = "rejected";
      })
      .addCase(getExpenseTypes.fulfilled, (state, action) => {
        state.getExpenseTypesStatus = "fulfilled";
        state.getExpenseTypes = action.payload;
      })
      ;
  },
});

export default accountsSlice.reducer;
