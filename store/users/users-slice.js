import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Users");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getTenants: null,
  getTenantsStatus: "idle",

  getTenant: null,
  getTenantStatus: "idle",

  getOwners: null,
  getOwnersStatus: "idle",

  getStaff: null,
  getStaffStatus: "idle",

  getSingleTenant: null,
  getSingleTenantStatus: "idle",

  getSingleLandlord: null,
  getSingleLandlordStatus: "idle",

};

export const getTenants = createAsyncThunk(
    "users/getTenants",
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
          Authorization: `Bearer ${accessToken} `,
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

  //getOwners
  export const getOwners = createAsyncThunk(
    "users/getOwners",
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
        url = `${API_URL}/users/owners?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getOwners::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getOwners::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getStaff
  export const getStaff = createAsyncThunk(
    "users/getStaff",
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
        url = `${API_URL}/users/staff?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getStaff::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getStaff::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

    //getSingleTenant
    export const getSingleTenant = createAsyncThunk(
      "users/getSingleTenant",
      async ({
        page = null,
        filter = null,
        accessToken = null,
        tenantId = null,
      } = {}) => {
  
        if(!accessToken){
          return;
        }
    
        let url = undefined;
        if (page) {
          url = page + "&";
        } else {
          url = `${API_URL}/users/show-tenant/${tenantId}?`;
        }
    
        const params = {};
  
        if (filter) {
          params["filter"] = filter;
        }
    
        url += new URLSearchParams(params);
    
        const startTime = new Date();
        logger.log("getSingleTenant::BEGIN");
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken} `,
            Accept: "application/json",
          },
        }).then(async (response) => {
          const data = await response.json();
          const endTime = new Date();
          const seconds = endTime.getTime() - startTime.getTime();
          logger.log("getSingleTenant::END", { took: seconds, data });
    
          if (!response.ok) {
            throw data;
          }
    
          return data;
        });
    
        return response;
      }
    );


    //getSingleLandlord
    export const getSingleLandlord = createAsyncThunk(
      "users/getSingleLandlord",
      async ({
        page = null,
        filter = null,
        accessToken = null,
        landlordId = null,
      } = {}) => {
  
        if(!accessToken){
          return;
        }
    
        let url = undefined;
        if (page) {
          url = page + "&";
        } else {
          url = `${API_URL}/users/show-landlord/${landlordId}?`;
        }
    
        const params = {};
  
        if (filter) {
          params["filter"] = filter;
        }
    
        url += new URLSearchParams(params);
    
        const startTime = new Date();
        logger.log("getSingleLandlord::BEGIN");
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken} `,
            Accept: "application/json",
          },
        }).then(async (response) => {
          const data = await response.json();
          const endTime = new Date();
          const seconds = endTime.getTime() - startTime.getTime();
          logger.log("getSingleLandlord::END", { took: seconds, data });
    
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
      accessToken = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
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
          Authorization: `Bearer ${accessToken} `,
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

      //getOwners
      .addCase(getOwners.pending, (state) => {
        state.getOwnersStatus = "loading";
      })
      .addCase(getOwners.rejected, (state) => {
        state.getOwnersStatus = "rejected";
      })
      .addCase(getOwners.fulfilled, (state, action) => {
        state.getOwnersStatus = "fulfilled";
        state.getOwners = action.payload;
      })

      //getStaff
      .addCase(getStaff.pending, (state) => {
        state.getStaffStatus = "loading";
      })
      .addCase(getStaff.rejected, (state) => {
        state.getStaffStatus = "rejected";
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.getStaffStatus = "fulfilled";
        state.getStaff = action.payload;
      })

      //getSingleTenant
      .addCase(getSingleTenant.pending, (state) => {
        state.getSingleTenantStatus = "loading";
      })
      .addCase(getSingleTenant.rejected, (state) => {
        state.getSingleTenantStatus = "rejected";
      })
      .addCase(getSingleTenant.fulfilled, (state, action) => {
        state.getSingleTenantStatus = "fulfilled";
        state.getSingleTenant = action.payload;
      })

      //getSingleLandlord
      .addCase(getSingleLandlord.pending, (state) => {
        state.getSingleLandlordStatus = "loading";
      })
      .addCase(getSingleLandlord.rejected, (state) => {
        state.getSingleLandlordStatus = "rejected";
      })
      .addCase(getSingleLandlord.fulfilled, (state, action) => {
        state.getSingleLandlordStatus = "fulfilled";
        state.getSingleLandlord = action.payload;
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
