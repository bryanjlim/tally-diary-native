import { UPDATE_ENTRIES, UPDATE_PREFERENCES, SET_USER_INFO, SET_PREFERENCES_ID,
          SET_ENTRIES_ID } from "./actionTypes";

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

export const setPreferencesId = preferencesId => ({
  type: SET_PREFERENCES_ID,
  payload: {
    preferencesId
  }
});

export const setEntriesId = entriesId => ({
  type: SET_ENTRIES_ID,
  payload: {
    entriesId
  }
});