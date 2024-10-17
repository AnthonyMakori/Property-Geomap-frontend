import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";
import { IconDashboard } from "@tabler/icons-react";

const logger = getLogger("Properties");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getBuildings: null,
  getBuildingsStatus: "idle",

  getUnits: null,
  getUnitsStatus: "idle",

  getLeases: null,
  getLeasesStatus: "idle",

  getOneBuilding: null,
  getOneBuildingStatus: "idle",

  getOneUnit: null,
  getOneUnitStatus: "idle",

  getUnitTypes: null,
  getUnitTypesStatus: "idle",

  getRepairs: null,
  getRepairsStatus: "idle",

  //getLands
  getLands: null,
  getLandsStatus: "idle",

  //getPlots
  getPlots: null,
  getPlotsStatus: "idle",

  //getPlotSales
  getPlotSales: null,
  getPlotSalesStatus: "idle",

  //Installments
  getInstallments: null,
  getInstallmentsStatus: "idle",

  //Lands Dashboard
  getLandDashboard: null,
  getLandDashboardStatus: "idle",

  getLandDocuments: null,
  getLandDocumentsStatus: "idle",

  getSaleDocuments: null,
  getSaleDocumentsStatus: "idle",
};

//getSaleDocuments
export const getSaleDocuments = createAsyncThunk(
  "properties/getSaleDocuments",
  async ({
    page = null,
    filter = null,
    accessToken = null,
    saleId = null,
  } = {}) => {

    if(!accessToken){
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/lands/sale-documents/${saleId}?`;
    }

    const params = {};
    if (saleId) {
      params['saleId'] = saleId;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getSaleDocuments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getSaleDocuments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getLandDocuments
export const getLandDocuments = createAsyncThunk(
  "properties/getLandDocuments",
  async ({
    page = null,
    filter = null,
    accessToken = null,
    saleId = null,
    landId = null,
  } = {}) => {

    if(!accessToken){
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/lands/documents/${landId}?`;
    }

    const params = {};
    if (saleId) {
      params['saleId'] = saleId;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getLandDocuments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLandDocuments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Land Dashboard
export const getLandDashboard = createAsyncThunk(
  "properties/getLandDashboard",
  async ({
    page = null,
    filter = null,
    accessToken = null,
    saleId = null,
  } = {}) => {

    if(!accessToken){
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/lands/dashboard?`;
    }

    const params = {};
    if (saleId) {
      params['saleId'] = saleId;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getLandDashboard::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLandDashboard::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Installments
export const getInstallments = createAsyncThunk(
  "properties/getInstallments",
  async ({
    page = null,
    filter = null,
    accessToken = null,
    saleId = null,
  } = {}) => {

    if(!accessToken){
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/lands/installments?`;
    }

    const params = {};
    if (saleId) {
      params['saleId'] = saleId;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getInstallments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInstallments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


//getPlotSales
export const getPlotSales = createAsyncThunk(
  "properties/getPlotSales",
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
      url = `${API_URL}/lands/sales?`;
    }

    const params = {};


    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getPlotSales::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getPlotSales::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getPlots
export const getPlots = createAsyncThunk(
  "properties/getPlots",
  async ({
    page = null,
    filter = null,
    accessToken = null,
    landId = null,
  } = {}) => {

    if(!accessToken){
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/lands/plots?`;
    }

    const params = {};

    if (landId) {
      params['landId'] = landId;
    }
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getPlots::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getPlots::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getLands
export const getLands = createAsyncThunk(
  "properties/getLands",
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
      url = `${API_URL}/lands?`;
    }

    const params = {};

    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getLands::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLands::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


export const getBuildings = createAsyncThunk(
    "properties/getBuildings",
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
          Authorization: `Bearer ${accessToken} `,
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
      accessToken = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
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
          Authorization: `Bearer ${accessToken} `,
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
      accessToken = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
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
          Authorization: `Bearer ${accessToken} `,
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

  //getRepairs
  export const getRepairs = createAsyncThunk(
    "properties/getRepairs",
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
        url = `${API_URL}/repairs/index?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }

      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getRepairs::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getRepairs::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getOneBuilding: null,
  export const getOneBuilding = createAsyncThunk(
    "properties/getOneBuilding",
    async ({
      page = null,
      filter = null,
      buildingId = null,
      unitType = null,
      accessToken = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/buildings/show/${buildingId}?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }

      if (unitType) {
        params["unit_type"] = unitType;
      }

      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getOneBuilding::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getOneBuilding::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getOneUnit
  export const getOneUnit = createAsyncThunk(
    "properties/getOneUnit",
    async ({
      page = null,
      filter = null,
      unitId = null,
      accessToken = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/units/show/${unitId}?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }

      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getOneUnit::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getOneUnit::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );  


  // getUnitTypes
  export const getUnitTypes = createAsyncThunk(
    "properties/getUnitTypes",
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

      //getPlotSales
      .addCase(getPlotSales.pending, (state) => {
        state.getPlotSalesStatus = "loading";
      })
      .addCase(getPlotSales.rejected, (state) => {
        state.getPlotSalesStatus = "rejected";
      })
      .addCase(getPlotSales.fulfilled, (state, action) => {
        state.getPlotSalesStatus = "fulfilled";
        state.getPlotSales = action.payload;
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
      })

      //getLandDocuments
      .addCase(getLandDocuments.pending, (state) => {
        state.getLandDocumentsStatus = "loading";
      })
      .addCase(getLandDocuments.rejected, (state) => {
        state.getLandDocumentsStatus = "rejected";
      })
      .addCase(getLandDocuments.fulfilled, (state, action) => {
        state.getLandDocumentsStatus = "fulfilled";
        state.getLandDocuments = action.payload;
      })

      //getLandDashboard
      .addCase(getLandDashboard.pending, (state) => {
        state.getLandDashboardStatus = "loading";
      })
      .addCase(getLandDashboard.rejected, (state) => {
        state.getLandDashboardStatus = "rejected";
      })
      .addCase(getLandDashboard.fulfilled, (state, action) => {
        state.getLandDashboardStatus = "fulfilled";
        state.getLandDashboard = action.payload;
      })

      //getOneBuilding
      .addCase(getOneBuilding.pending, (state) => {
        state.getOneBuildingStatus = "loading";
      })
      .addCase(getOneBuilding.rejected, (state) => {
        state.getOneBuildingStatus = "rejected";
      })
      .addCase(getOneBuilding.fulfilled, (state, action) => {
        state.getOneBuildingStatus = "fulfilled";
        state.getOneBuilding = action.payload;
      })

      //getInstallments
      .addCase(getInstallments.pending, (state) => {
        state.getInstallmentsStatus = "loading";
      })
      .addCase(getInstallments.rejected, (state) => {
        state.getInstallmentsStatus = "rejected";
      })
      .addCase(getInstallments.fulfilled, (state, action) => {
        state.getInstallmentsStatus = "fulfilled";
        state.getInstallments = action.payload;
      })

      //getOneUnit
      .addCase(getOneUnit.pending, (state) => {
        state.getOneUnitStatus = "loading";
      })
      .addCase(getOneUnit.rejected, (state) => {
        state.getOneUnitStatus = "rejected";
      })
      .addCase(getOneUnit.fulfilled, (state, action) => {
        state.getOneUnitStatus = "fulfilled";
        state.getOneUnit = action.payload;
      })

      //getLands
      .addCase(getLands.pending, (state) => {
        state.getLandsStatus = "loading";
      })
      .addCase(getLands.rejected, (state) => {
        state.getLandsStatus = "rejected";
      })
      .addCase(getLands.fulfilled, (state, action) => {
        state.getLandsStatus = "fulfilled";
        state.getLands = action.payload;
      })

      //getSaleDocuments
      .addCase(getSaleDocuments.pending, (state) => {
        state.getSaleDocumentsStatus = "loading";
      })
      .addCase(getSaleDocuments.rejected, (state) => {
        state.getSaleDocumentsStatus = "rejected";
      })
      .addCase(getSaleDocuments.fulfilled, (state, action) => {
        state.getSaleDocumentsStatus = "fulfilled";
        state.getSaleDocuments = action.payload;
      })

      //getPlots
      .addCase(getPlots.pending, (state) => {
        state.getPlotsStatus = "loading";
      })
      .addCase(getPlots.rejected, (state) => {
        state.getPlotsStatus = "rejected";
      })
      .addCase(getPlots.fulfilled, (state, action) => {
        state.getPlotsStatus = "fulfilled";
        state.getPlots = action.payload;
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
      
      //getRepairs
      .addCase(getRepairs.pending, (state) => {
        state.getRepairsStatus = "loading";
      })
      .addCase(getRepairs.rejected, (state) => {
        state.getRepairsStatus = "rejected";
      })
      .addCase(getRepairs.fulfilled, (state, action) => {
        state.getRepairsStatus = "fulfilled";
        state.getRepairs = action.payload;
      });
  },
});

export default buildingsSlice.reducer;
