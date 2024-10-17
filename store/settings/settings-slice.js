import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Settings");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getStreets: null,
  getStreetsStatus: "idle",

  getTaxes: null,
  getTaxesStatus: 'idle',

  getZones: null,
  getZonesStatus: "idle",

  getUnitTypes: null,
  getUnitTypesStatus: "idle",

  getStkLogs: null,
  getStkLogsStatus: "idle",

  getAccessGroups: null,
  getAccessGroupsStatus: "idle",

  getSystemSettings: null,
  getSystemSettingsStatus: "idle",
};


  //getTaxes
  export const getTaxes = createAsyncThunk(
    "settings/getTaxes",
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
        url = `${API_URL}/settings/taxes-list?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getTaxes::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getTaxes::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


  //getStreets
  export const getStreets = createAsyncThunk(
    "users/getStreets",
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
        url = `${API_URL}/locations/streets?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getStreets::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getStreets::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getSystemSettings
  export const getSystemSettings = createAsyncThunk(
    "settings/getSystemSettings",
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
        url = `${API_URL}/settings/system?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getSystemSettings::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getSystemSettings::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );
  //

  //getStkLogs
  export const getStkLogs = createAsyncThunk(
    "users/getStkLogs",
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
        url = `${API_URL}/reports/stk-logs?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getStkLogs::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getStkLogs::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getAccessGroups
  export const getAccessGroups = createAsyncThunk(
    "settings/getAccessGroups",
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
        url = `${API_URL}/settings/access-groups?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getAccessGroups::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getAccessGroups::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getZones
  export const getZones = createAsyncThunk(
    "locations/getZones",
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
        url = `${API_URL}/locations/zones?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getZones::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getZones::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getUnitTypes
  export const getUnitTypes = createAsyncThunk(
    "units/getUnitTypes",
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
        url = `${API_URL}/units/unit-types?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getUnitTypes::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getUnitTypes::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Streets Data
      .addCase(getStreets.pending, (state) => {
        state.getStreetsStatus = "loading";
      })
      .addCase(getStreets.rejected, (state) => {
        state.getStreetsStatus = "rejected";
      })
      .addCase(getStreets.fulfilled, (state, action) => {
        state.getStreetsStatus = "fulfilled";
        state.getStreets = action.payload;
      })
      //getSystemSettings
      .addCase(getSystemSettings.pending, (state) => {
        state.getSystemSettingsStatus = "loading";
      })
      .addCase(getSystemSettings.rejected, (state) => {
        state.getSystemSettingsStatus = "rejected";
      })
      .addCase(getSystemSettings.fulfilled, (state, action) => {
        state.getSystemSettingsStatus = "fulfilled";
        state.getSystemSettings = action.payload;
      })
      //getUnitTypes
      .addCase(getUnitTypes.pending, (state) => {
        state.getUnitTypesStatus = "loading";
      })
      .addCase(getUnitTypes.rejected, (state) => {
        state.getUnitTypesStatus = "rejected";
      })
      .addCase(getUnitTypes.fulfilled, (state, action) => {
        state.getUnitTypesStatus = "fulfilled";
        state.getUnitTypes = action.payload;
      })

      //getAccessGroups
      .addCase(getAccessGroups.pending, (state) => {
        state.getAccessGroupsStatus = "loading";
      })
      .addCase(getAccessGroups.rejected, (state) => {
        state.getAccessGroupsStatus = "rejected";
      })
      .addCase(getAccessGroups.fulfilled, (state, action) => {
        state.getAccessGroupsStatus = "fulfilled";
        state.getAccessGroups = action.payload;
      })

      //getTaxes
      .addCase(getTaxes.pending, (state) => {
        state.getTaxesStatus = "loading";
      })
      .addCase(getTaxes.rejected, (state) => {
        state.getTaxesStatus = "rejected";
      })
      .addCase(getTaxes.fulfilled, (state, action) => {
        state.getTaxesStatus = "fulfilled";
        state.getTaxes = action.payload;
      })

      //getStkLogs
      .addCase(getStkLogs.pending, (state) => {
        state.getStkLogsStatus = "loading";
      })
      .addCase(getStkLogs.rejected, (state) => {
        state.getStkLogsStatus = "rejected";
      })
      .addCase(getStkLogs.fulfilled, (state, action) => {
        state.getStkLogsStatus = "fulfilled";
        state.getStkLogs = action.payload;
      })

      // Zones Data
      .addCase(getZones.pending, (state) => {
        state.getZonesStatus = "loading";
      })
      .addCase(getZones.rejected, (state) => {
        state.getZonesStatus = "rejected";
      })
      .addCase(getZones.fulfilled, (state, action) => {
        state.getZonesStatus = "fulfilled";
        state.getZones = action.payload;
      })
      ;
  },
});

export default settingsSlice.reducer;
