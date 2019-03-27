import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import DriveHelper from '../Helpers/newDriveHelper'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.centerContainer}>
        <Text>You've Signed In!</Text>
      </View>
    )
  }
}
