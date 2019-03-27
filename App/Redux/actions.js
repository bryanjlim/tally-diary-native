import { UPDATE_ENTRIES, UPDATE_PREFERENCES, SET_USER_INFO } from "./actionTypes";

export const updateEntries = entries => ({
  type: UPDATE_ENTRIES,
  payload: {
    entries
  }
});

export const updatePreferences = preferences => ({
  type: UPDATE_PREFERENCES,
  payload: {
    preferences
  }
});

export const setUserInfo = userInfo => ({
  type: SET_USER_INFO,
  payload: {
    userInfo
  }
});