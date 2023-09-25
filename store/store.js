import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import buildingsReducer from "./properties/buildings/buildings-slice";
import usersReducer from "./users/users-slice";
import accountsReducer from "./accounts/accounts-slice";

const listenerMiddleware = createListenerMiddleware();

export default configureStore({
  reducer: {
    buildings: buildingsReducer,
    users: usersReducer,
    accounts: accountsReducer,
  },
  // Add the listener middleware to the store.
  // NOTE: Since this can receive actions with functions inside,
  // it should go before the serializability check middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).prepend(listenerMiddleware.middleware),
});
