import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import buildingsReducer from "./properties/buildings/buildings-slice";
import usersReducer from "./users/users-slice";
import accountsReducer from "./accounts/accounts-slice";
import communicationsReducer from "./communications/communication-slice";
import dashboardReducer from "./dashboard/dashboard-slice";
import reportsReducer from "./reports/reports-slice";
import settingsReducer from "./settings/settings-slice";

const listenerMiddleware = createListenerMiddleware();

export default configureStore({
  reducer: {
    buildings: buildingsReducer,
    users: usersReducer,
    accounts: accountsReducer,
    communication: communicationsReducer,
    dashboard: dashboardReducer,
    reports: reportsReducer,
    settings: settingsReducer,
  },
  // Add the listener middleware to the store.
  // NOTE: Since this can receive actions with functions inside,
  // it should go before the serializability check middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).prepend(listenerMiddleware.middleware),
});
