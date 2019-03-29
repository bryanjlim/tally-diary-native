import React, { Component } from 'react'
import { View, ActivityIndicator } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { updatePreferences, updateEntries, setPreferencesId, setEntriesId } from '../Redux/actions'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/LaunchScreenStyles'
import Colors from '../Themes/Colors'

class LaunchScreen extends Component {

  componentDidMount() {
    const { replace } = this.props.navigation;
    DriveHelper.getFileList(this.props.accessToken).then((files) => {
      if (files.length == 0) {
        // New User
        replace("UserSetupScreen");
      } else {
        // Returning User
        const preferencesId = files[0].name == '0' ? files[0].id : files[1].id;
        const entriesId = files[0].name == '0' ? files[1].id : files[0].id;

        this.props.setPreferencesId(preferencesId);
        this.props.setEntriesId(entriesId);

        DriveHelper.getFileById(this.props.accessToken, preferencesId).then((preferences) => {
          this.props.updatePreferences(JSON.parse(preferences));
          DriveHelper.getFileById(this.props.accessToken, entriesId).then((entries) => {
            let entriesArray = JSON.parse(entries);
            entriesArray.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            this.props.updateEntries(entriesArray);
            replace("DrawerNavigator");
          });
        });
      }
    })
  }

  render() {
    return (
      <View style={styles.centerContainerBlue}>
        <ActivityIndicator size="large" color="white" />
      </View>
    )
  }
}

const mapStateToProps = (store) => {
  return { accessToken: store.userInfo.userInfo.accessToken }
}

export default connect(
  mapStateToProps,
  { updatePreferences, updateEntries, setPreferencesId, setEntriesId }
)(LaunchScreen)