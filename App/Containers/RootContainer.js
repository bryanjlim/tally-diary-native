import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import LaunchScreen from '../Containers/LaunchScreen'
import SignInLoadingScreen from '../Containers/SignInLoadingScreen'
import { createAppContainer, createStackNavigator } from 'react-navigation'

// Styles
import styles from './Styles/RootContainerStyles'

const AppNavigator = createStackNavigator(
  {
    LaunchScreen: LaunchScreen,
    SignInLoadingScreen: SignInLoadingScreen
  },
  {
    initialRouteName: "LaunchScreen"
  }
);

const AppContainer = createAppContainer(AppNavigator);

class RootContainer extends Component {
  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <AppContainer />
      </View>
    )
  }
}

export default RootContainer;
