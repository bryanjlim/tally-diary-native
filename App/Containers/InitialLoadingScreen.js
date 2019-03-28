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
    const { replace } = this.props.navigation;
    DriveHelper.getFileList(this.props.accessToken).then((files) => {
        if(files.length == 0) {
            // New User
            replace("UserSetupScreen");
        } else {
            // Returning User
            const preferencesId = files[0].name == '0' ? files[0].id : files[1].id;
            const entriesId = files[0].name == '0' ? files[1].id : files[0].id;
            DriveHelper.getFileById(this.props.accessToken, preferencesId).then((preferences) => {
                this.props.updatePreferences(preferences);
                console.log(preferences)
                DriveHelper.getFileById(this.props.accessToken, entriesId).then((entries) => {
                    this.props.updateEntries(entries);
                    console.log(entries)
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