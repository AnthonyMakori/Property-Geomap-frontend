import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import dashboardReducer from "./users/dashboard/dashboard-slice";

const listenerMiddleware = createListenerMiddleware();

export default configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
  // Add the listener middleware to the store.
  // NOTE: Since this can receive actions with functions inside,
  // it should go before the serializability check middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).prepend(listenerMiddleware.middleware),
});
