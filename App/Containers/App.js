import '../Config'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Provider as PaperProvider } from 'react-native-paper'
import RootContainer from './RootContainer'
import store from '../Redux/store'

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
export default class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <PaperProvider>
          <RootContainer />
        </PaperProvider>
      </Provider>
    )
  }
}
