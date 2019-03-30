import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import LaunchScreen from '../Containers/LaunchScreen'
import TimelineScreen from '../Containers/TimelineScreen'
import InsightsScreen from '../Containers/InsightsScreen'
import InitialLoadingScreen from '../Containers/InitialLoadingScreen'
import UserSetupScreen from '../Containers/UserSetupScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import AddEntryScreen from './AddEntryScreen'
import { createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation'

// Styles
import styles from './Styles/RootContainerStyles'
import Colors from '../Themes/Colors'

const DrawerNavigator = createDrawerNavigator({
  "Add Entry": {
    screen: AddEntryScreen,
  },
  "Timeline": {
    screen: TimelineScreen,
  },
  "Insights": {
    screen: InsightsScreen,
  },
  "Settings": {
    screen: SettingsScreen,
  },
},
  {
    navigationOptions: () => ({ header: null }),
    contentOptions: {
      activeBackgroundColor: Colors.background,
      activeTintColor: Colors.blue,
      inactiveBackgroundColor: Colors.blue,
      inactiveTintColor: Colors.background,
    },
    drawerBackgroundColor: Colors.blue,
  },
);


const AppNavigator = createStackNavigator(
  {
    LaunchScreen: LaunchScreen,
    InitialLoadingScreen: InitialLoadingScreen,
    UserSetupScreen: UserSetupScreen,
    DrawerNavigator: DrawerNavigator,
  },
  {
    initialRouteName: "LaunchScreen",
    headerMode: 'none',
    navigationOptions: () => ({ header: null })
  },
);

const AppContainer = createAppContainer(AppNavigator);

class RootContainer extends Component {
  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar backgroundColor={Colors.blue} barStyle="light-content" />
        <AppContainer />
      </View>
    )
  }
}

export default RootContainer;
