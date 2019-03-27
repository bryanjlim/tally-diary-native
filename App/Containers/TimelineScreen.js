import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'
import DriveHelper from '../Helpers/newDriveHelper'

import { getDiaryEntries, getUserPreferences } from '../Redux/selectors'
import { updateEntries, updatePreferences } from '../Redux/actions'

// Styles
import styles from './Styles/LaunchScreenStyles'

class TimelineSreen extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <View style={styles.centerContainer}>
        <Text>Timeline</Text>
      </View>
    )
  }
}

const mapStateToProps = () => {
  const entries = getDiaryEntries();
  const preferences = getUserPreferences();
  return { entries, preferences };
}

export default connect(
  mapStateToProps,
  { updateEntries, updatePreferences }
)(TimelineSreen)