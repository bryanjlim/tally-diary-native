import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { connect } from 'react-redux'
import { updateEntries, updatePreferences } from '../Redux/actions'

class TimelineSreen extends Component {
  render() {
    return (
      <View>
        <Text>Timeline</Text>
      </View>
    )
  }
}

const mapStateToProps = (store) => {
  const entries = store.entries.entries;
  const preferences = store.preferences.preferences;
  console.log(store.userInfo)
  return { entries, preferences };
}

export default connect(
  mapStateToProps,
  { updateEntries, updatePreferences }
)(TimelineSreen)