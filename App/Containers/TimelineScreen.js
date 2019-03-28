import React, { Component } from 'react'
import { SafeAreaView, Text, Image, View } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { connect } from 'react-redux'
import { Appbar } from 'react-native-paper';
import { updateEntries, updatePreferences } from '../Redux/actions'

// Styles
import styles from './Styles/TimelineScreenStyles'

class TimelineSreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.notchContainer}>
        <Appbar style={styles.appBar}>
          <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar>
        <View style={styles.mainContainer}>
          <Text>Timeline2</Text>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (store) => {
  const entries = store.entries.entries;
  const preferences = store.preferences.preferences;
  return { entries, preferences };
}

export default connect(
  mapStateToProps,
  { updateEntries, updatePreferences }
)(TimelineSreen)