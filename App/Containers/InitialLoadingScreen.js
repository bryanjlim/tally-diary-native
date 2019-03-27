import React, { Component } from 'react'
import { View } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { updatePreferences, updateEntries } from '../Redux/actions'
import { Button } from 'react-native-paper';
import { connect } from 'react-redux'

// Styles
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends Component {

  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    DriveHelper.getFileList(this.props.accessToken).then((files) => {
        if(files == null || files == undefined || files.length == 0) {
            // New User
        } else {
            const preferencesId = files[0].id;
            const entriesId = files[1].id;

            DriveHelper.getFileById(this.props.accessToken, preferencesId).then((preferences) => {
            this.props.updatePreferences(preferences);

            DriveHelper.getFileById(this.props.accessToken, entriesId).then((entries) => {
                this.props.updateEntries(entries);

                const { replace } = this.props.navigation;
                replace("DrawerNavigator");
            });
            });
        }
    })
  }

  render() {
    return (
      <View style={styles.centerContainer}>
        <Button loading={true} mode="text">
        </Button>
      </View>
    )
  }
}

const mapStateToProps = (store) => {
  return {accessToken: store.userInfo.userInfo.accessToken}
}

export default connect(
    mapStateToProps,
  { updatePreferences, updateEntries }
)(LaunchScreen)