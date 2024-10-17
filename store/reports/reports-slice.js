import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("Reports");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getVacantUnits: null,
  getVacantUnitsStatus: "idle",

  getOccupiedUnits: null,
  getOccupiedUnitsStatus: "idle",

  getIncomes: null,
  getIncomesStatus: "idle",

  getExpenses: null,
  getExpensesStatus: "idle",

  getProfitLoss: null,
  getProfitLossStatus: "idle",

  getLandlordStatement: null,
  getLandlordStatementStatus: "idle",

  getRefunds: null,
  getRefundsStatus: "idle",

  getBalanceSheet: null,
  getBalanceSheetStatus: "idle",

  getCommissions: null,
  getCommissionsStatus: "idle",

  //getClientStatement
  getClientStatement: null,
  getClientStatementStatus: "idle",

  //getTaxes
  getTaxes: null,
  getTaxesStatus: "idle",

  //getTrialBalance
  getTrialBalance: null,
  getTrialBalanceStatus: "idle",

  //getInvoicesAgingReport
  getInvoicesAgingReport: null,
  getInvoicesAgingReportStatus: "idle",

  //getBuldingReport
  getBuldingReport: null,
  getBuldingReportStatus: "idle",

};

//getBuldingReport
export const getBuldingReport = createAsyncThunk(
  "reports/getBuldingReport",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
    itemId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/building-report/${itemId}?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getBuldingReport::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBuldingReport::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getInvoicesAgingReport
export const getInvoicesAgingReport = createAsyncThunk(
  "assets/getInvoicesAgingReport",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/invoices/aging-report?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getInvoicesAgingReport::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInvoicesAgingReport::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getTaxes
export const getTaxes = createAsyncThunk(
  "assets/getTaxes",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/lands/taxes?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
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

//getAssets
export const getAssets = createAsyncThunk(
  "assets/getAssets",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/assets?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getAssets::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAssets::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getCommissions
export const getCommissions = createAsyncThunk(
  "assets/getCommissions",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/commissions?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getCommissions::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCommissions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getLiabilities
export const getLiabilities = createAsyncThunk(
  "assets/getLiabilities",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/liabilities?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getLiabilities::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLiabilities::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Getincome
export const getIncome = createAsyncThunk(
  "income/getIncome",
  async ({
    accessToken = null,
    page = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/incomes?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getIncome::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getIncome::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getVacantUnits = createAsyncThunk(
    "units/getVacantUnits",
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
        url = `${API_URL}/reports/vacant?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getVacantUnits::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getVacantUnits::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //Trial Balance
  export const getTrialBalance = createAsyncThunk(
    "reports/getTrialBalance",
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
        url = `${API_URL}/reports/trial-balance?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getTrialBalance::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getTrialBalance::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getBalanceSheet
  export const getBalanceSheet = createAsyncThunk(
    "reports/getBalanceSheet",
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
        url = `${API_URL}/reports/balance-sheet?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getBalanceSheet::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getBalanceSheet::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getClientStatement
  export const getClientStatement = createAsyncThunk(
    "reports/getClientStatement",
    async ({
      page = null,
      filter = null,
      accessToken = null,
      clientId = null,
    } = {}) => {

      if(!accessToken){
        return;
      }
  
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/reports/client-statement?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }

      if (clientId) {
        params["clientId"] = clientId;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getClientStatement::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getClientStatement::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


  //getLandlordStatement
  export const getLandlordStatement = createAsyncThunk(
    "reports/getLandlordStatement",
    async ({
      page = null,
      filter = null,
      accessToken = null,
      landlordId = null,
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
        url = `${API_URL}/reports/landlord-statement/${landlordId}?`;
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
      logger.log("getLandlordStatement::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getLandlordStatement::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getRefunds
  export const getRefunds = createAsyncThunk(
    "refunds/getRefunds",
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
        url = `${API_URL}/reports/refunds?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getRefunds::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getRefunds::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //
  export const getOccupiedUnits = createAsyncThunk(
    "units/getOccupiedUnits",
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
        url = `${API_URL}/reports/occupied?`;
      }
  
      const params = {};

      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getOccupiedUnits::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getOccupiedUnits::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

  //getIncomes
  export const getIncomes = createAsyncThunk(
    "income/getIncomes",
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
        url = `${API_URL}/reports/income?`;
      }
  
      const params = {};
      if (startDate) {
        params["start_date"] = startDate;
      }
      if (endDate) {
        params["end_date"] = endDate;
      }
      if (filter) {
        params["filter"] = filter;
      }
  
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("getIncomes::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("getIncomes::END", { took: seconds, data });
  
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
    "income/getExpenses",
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
        url = `${API_URL}/reports/expenses?`;
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

  
//getProfitLoss
export const getProfitLoss = createAsyncThunk(
  "reports/getProfitLoss",
  async ({
    page = null,
    startDate = null,
    endDate = null,
    accessToken = null,
  } = {}) => {

    if(!accessToken){
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/profit-loss?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getProfitLoss::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProfitLoss::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);
  

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getVacantUnits Data
      .addCase(getVacantUnits.pending, (state) => {
        state.getVacantUnitsStatus = "loading";
      })
      .addCase(getVacantUnits.rejected, (state) => {
        state.getVacantUnitsStatus = "rejected";
      })
      .addCase(getVacantUnits.fulfilled, (state, action) => {
        state.getVacantUnitsStatus = "fulfilled";
        state.getVacantUnits = action.payload;
      })

      //getInvoicesAgingReport
      .addCase(getInvoicesAgingReport.pending, (state) => {
        state.getInvoicesAgingReportStatus = "loading";
      })
      .addCase(getInvoicesAgingReport.rejected, (state) => {
        state.getInvoicesAgingReportStatus = "rejected";
      })
      .addCase(getInvoicesAgingReport.fulfilled, (state, action) => {
        state.getInvoicesAgingReportStatus = "fulfilled";
        state.getInvoicesAgingReport = action.payload;
      })

      //getBalanceSheet
      .addCase(getBalanceSheet.pending, (state) => {
        state.getBalanceSheetStatus = "loading";
      })
      .addCase(getBalanceSheet.rejected, (state) => {
        state.getBalanceSheetStatus = "rejected";
      })
      .addCase(getBalanceSheet.fulfilled, (state, action) => {
        state.getBalanceSheetStatus = "fulfilled";
        state.getBalanceSheet = action.payload;
      })

      //getIncome
      .addCase(getIncome.pending, (state) => {
        state.getIncomeStatus = "loading";
      })
      .addCase(getIncome.rejected, (state) => {
        state.getIncomeStatus = "rejected";
        logger.log("getIncome::REJECTED");
      })
      .addCase(getIncome.fulfilled, (state, action) => {
        state.getIncomeStatus = "fulfilled";
        state.getIncome = action.payload;
      })

      //getBuldingReport
      .addCase(getBuldingReport.pending, (state) => {
        state.getBuldingReportStatus = "loading";
      })
      .addCase(getBuldingReport.rejected, (state) => {
        state.getBuldingReportStatus = "rejected";
        logger.log("getBuldingReport::REJECTED");
      })
      .addCase(getBuldingReport.fulfilled, (state, action) => {
        state.getBuldingReportStatus = "fulfilled";
        state.getBuldingReport = action.payload;
      })

      //getTrialBalance
      .addCase(getTrialBalance.pending, (state) => {
        state.getTrialBalanceStatus = "loading";
      })
      .addCase(getTrialBalance.rejected, (state) => {
        state.getTrialBalanceStatus = "rejected";
        logger.log("getTrialBalance::REJECTED");
      })
      .addCase(getTrialBalance.fulfilled, (state, action) => {
        state.getTrialBalanceStatus = "fulfilled";
        state.getTrialBalance = action.payload;
      })

      //getAssets
      .addCase(getAssets.pending, (state) => {
        state.getAssetsStatus = "loading";
      })
      .addCase(getAssets.rejected, (state) => {
        state.getAssetsStatus = "rejected";
        logger.log("getAssets::REJECTED");
      })
      .addCase(getAssets.fulfilled, (state, action) => {
        state.getAssetsStatus = "fulfilled";
        state.getAssets = action.payload;
      })

      //getLiabilities
      .addCase(getLiabilities.pending, (state) => {
        state.getLiabilitiesStatus = "loading";
      })
      .addCase(getLiabilities.rejected, (state) => {
        state.getLiabilitiesStatus = "rejected";
        logger.log("getLiabilities::REJECTED");
      })
      .addCase(getLiabilities.fulfilled, (state, action) => {
        state.getLiabilitiesStatus = "fulfilled";
        state.getLiabilities = action.payload;
      })

      //getCommissions
      .addCase(getCommissions.pending, (state) => {
        state.getCommissionsStatus = "loading";
      })
      .addCase(getCommissions.rejected, (state) => {
        state.getCommissionsStatus = "rejected";
      })
      .addCase(getCommissions.fulfilled, (state, action) => {
        state.getCommissionsStatus = "fulfilled";
        state.getCommissions = action.payload;
      })


      //getRefunds
      .addCase(getRefunds.pending, (state) => {
        state.getRefundsStatus = "loading";
      })
      .addCase(getRefunds.rejected, (state) => {
        state.getRefundsStatus = "rejected";
      })
      .addCase(getRefunds.fulfilled, (state, action) => {
        state.getRefundsStatus = "fulfilled";
        state.getRefunds = action.payload;
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

      //getClientStatement
      .addCase(getClientStatement.pending, (state) => {
        state.getClientStatementStatus = "loading";
      })
      .addCase(getClientStatement.rejected, (state) => {
        state.getClientStatementStatus = "rejected";
      })
      .addCase(getClientStatement.fulfilled, (state, action) => {
        state.getClientStatementStatus = "fulfilled";
        state.getClientStatement = action.payload;
      })

      //getLandlordStatement
      .addCase(getLandlordStatement.pending, (state) => {
        state.getLandlordStatementStatus = "loading";
      })
      .addCase(getLandlordStatement.rejected, (state) => {
        state.getLandlordStatementStatus = "rejected";
      })
      .addCase(getLandlordStatement.fulfilled, (state, action) => {
        state.getLandlordStatementStatus = "fulfilled";
        state.getLandlordStatement = action.payload;
      })

      // getOccupiedUnits Data
      .addCase(getOccupiedUnits.pending, (state) => {
        state.getOccupiedUnitsStatus = "loading";
      })
      .addCase(getOccupiedUnits.rejected, (state) => {
        state.getOccupiedUnitsStatus = "rejected";
      })
      .addCase(getOccupiedUnits.fulfilled, (state, action) => {
        state.getOccupiedUnitsStatus = "fulfilled";
        state.getOccupiedUnits = action.payload;
      })

      //getIncomes
      .addCase(getIncomes.pending, (state) => {
        state.getIncomesStatus = "loading";
      })
      .addCase(getIncomes.rejected, (state) => {
        state.getIncomesStatus = "rejected";
      })
      .addCase(getIncomes.fulfilled, (state, action) => {
        state.getIncomesStatus = "fulfilled";
        state.getIncomes = action.payload;
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

      //getProfitLoss
      .addCase(getProfitLoss.pending, (state) => {
        state.getProfitLossStatus = "loading";
      })
      .addCase(getProfitLoss.rejected, (state) => {
        state.getProfitLossStatus = "rejected";
      })
      .addCase(getProfitLoss.fulfilled, (state, action) => {
        state.getProfitLossStatus = "fulfilled";
        state.getProfitLoss = action.payload;
      });

  },
});

export default reportsSlice.reducer;
