import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Users");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getTenants: null,
  getTenantsStatus: "idle",

  getTenant: null,
  getTenantStatus: "idle",

};

export const getTenants = createAsyncThunk(
    "users/getTenants",
    async ({
      page = null,
      filter = null,
    } = {}) => {
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/users/tenants?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getTenants::BEGIN");
      const response = await fetch(url, {
        headers: {
        //   Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getTenants::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getTenant
  export const getTenant = createAsyncThunk(
    "users/getTenant",
    async ({
      page = null,
      filter = null,
      tenantId = null,
    } = {}) => {
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/dashboard/tenant/${tenantId}?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getTenant::BEGIN");
      const response = await fetch(url, {
        headers: {
        //   Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getTenant::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Tenants Data
      .addCase(getTenants.pending, (state) => {
        state.getTenantsStatus = "loading";
      })
      .addCase(getTenants.rejected, (state) => {
        state.getTenantsStatus = "rejected";
      })
      .addCase(getTenants.fulfilled, (state, action) => {
        state.getTenantsStatus = "fulfilled";
        state.getTenants = action.payload;
      })
      
      .addCase(getTenant.pending, (state) => {
        state.getTenantStatus = "loading";
      })
      .addCase(getTenant.rejected, (state) => {
        state.getTenantStatus = "rejected";
      })
      .addCase(getTenant.fulfilled, (state, action) => {
        state.getTenantStatus = "fulfilled";
        state.getTenant = action.payload;
      });
  },
});

export default usersSlice.reducer;
