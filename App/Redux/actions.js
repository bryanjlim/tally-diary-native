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

export const setAuthentication = accessToken => ({
    type: SET_AUTHENTICATION,
    payload: {
      accessToken
    }
});