import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Properties");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getBuildings: null,
  getBuildingsStatus: "idle",

  getUnits: null,
  getUnitsStatus: "idle",

  getLeases: null,
  getLeasesStatus: "idle",


};

export const getBuildings = createAsyncThunk(
    "properties/getBuildings",
    async ({
      page = null,
      filter = null,
    } = {}) => {
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/buildings/index?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getBuildings::BEGIN");
      const response = await fetch(url, {
        headers: {
        //   Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getBuildings::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  export const getUnits = createAsyncThunk(
    "properties/getUnits",
    async ({
      page = null,
      filter = null,
      buildingId = null,
    } = {}) => {
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/units/index?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }

      if (buildingId) {
        params["buildingId"] = buildingId;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getUnits::BEGIN");
      const response = await fetch(url, {
        headers: {
        //   Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getUnits::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getLeases
  export const getLeases = createAsyncThunk(
    "properties/getLeases",
    async ({
      page = null,
      filter = null,
    } = {}) => {
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/leases/index?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }

      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getLeases::BEGIN");
      const response = await fetch(url, {
        headers: {
        //   Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getLeases::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


const buildingsSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Buildings Data
      .addCase(getBuildings.pending, (state) => {
        state.getBuildingsStatus = "loading";
      })
      .addCase(getBuildings.rejected, (state) => {
        state.getBuildingsStatus = "rejected";
      })
      .addCase(getBuildings.fulfilled, (state, action) => {
        state.getBuildingsStatus = "fulfilled";
        state.getBuildings = action.payload;
      })

      // Units Data
      .addCase(getUnits.pending, (state) => {
        state.getUnitsStatus = "loading";
      })
      .addCase(getUnits.rejected, (state) => {
        state.getUnitsStatus = "rejected";
      })
      .addCase(getUnits.fulfilled, (state, action) => {
        state.getUnitsStatus = "fulfilled";
        state.getUnits = action.payload;
      })

      // Leases Data
      .addCase(getLeases.pending, (state) => {
        state.getLeasesStatus = "loading";
      })
      .addCase(getLeases.rejected, (state) => {
        state.getLeasesStatus = "rejected";
      })
      .addCase(getLeases.fulfilled, (state, action) => {
        state.getLeasesStatus = "fulfilled";
        state.getLeases = action.payload;
      });
  },
});

export default buildingsSlice.reducer;
