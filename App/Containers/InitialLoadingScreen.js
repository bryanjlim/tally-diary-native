import React, { Component } from 'react'
import { View, ActivityIndicator, Image } from 'react-native'
import DriveHelper from '../Helpers/driveHelper'
import { TextInput, Title, Button, Snackbar } from 'react-native-paper'
import { updatePreferences, updateEntries, setPreferencesId, setEntriesId } from '../Redux/actions'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/LaunchScreenStyles'
import Colors from '../Themes/Colors'

class LaunchScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      usePassword: false,
      passwordError: false,
      password: '',
      passwordAttempt: '',
      driveErrorExists: false,
      errorToShow: '',
    }

    this.attemptUnlock = this.attemptUnlock.bind(this);
  }

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
          const parsedPreferences = JSON.parse(preferences);
          parsedPreferences.appLaunches++;
          DriveHelper.patchFile(this.props.accessToken, parsedPreferences, "0", preferencesId);
          this.props.updatePreferences(parsedPreferences);
          DriveHelper.getFileById(this.props.accessToken, entriesId).then((entries) => {
            let entriesArray = JSON.parse(entries);
            if (entriesArray instanceof Array) {
              entriesArray.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              })
            }

            this.props.updateEntries(entriesArray);

            if (parsedPreferences.usePassword) {
              // Request password
              this.setState({
                usePassword: true,
                password: parsedPreferences.password,
                passwordError: false,
              });
            } else {
              replace("DrawerNavigator");
            }
          });
        });
      }
    }).catch((err) => {
      this.setState({
        driveErrorExists: true,
        errorToShow: "Error connecting to Google servers. Please try again"
      })
    });
  }

  attemptUnlock() {
    if (this.state.passwordAttempt == this.state.password) {
      this.setState({
        usePassword: false,
        passwordAttempt: '',
        passwordError: false,
        password: '',
        driveErrorExists: false,
        errorToShow: '',
      })
      const { replace } = this.props.navigation;
      replace("DrawerNavigator");
    } else {
      this.setState({
        passwordError: true,
      })
    }
  }

  render() {
    if (this.state.usePassword) {
      // Password Check
      return (
        <View style={styles.centerContainerBlue}>
          <View>
            <Title style={{ color: 'white', alignSelf: 'center' }}>This Diary Is Locked</Title>
            <View style={{ height: 55, width: 250, marginBottom: 15, marginTop: 30, }}>
              <TextInput
                error={this.state.passwordError}
                value={this.state.passwordAttempt}
                placeholder="Please Enter Your Password"
                secureTextEntry={true}
                style={{ color: 'white', backgroundColor: 'white' }}
                onChangeText={(passwordAttempt) => { this.setState({ passwordAttempt }) }}
                theme={{ colors: { primary: Colors.blue } }}
              />
            </View>
            <View style={{ width: 250, alignSelf: 'center' }}>
              <Button
                style={{ backgroundColor: 'white' }}
                onPress={this.attemptUnlock}
                theme={{ colors: { primary: Colors.blue } }}
              >
                Unlock Diary
            </Button>
            </View>
          </View>
        </View >
      );
    } else {
      return (
        <View style={styles.centerContainerBlue}>
                      <View style={{ marginBottom: 20 }}>
                <Image source={require('../Images/TextLogoWhite.png')} style={{
                  width: 250,
                  resizeMode: 'contain'
                }} />
              </View>
              <View>
              <ActivityIndicator size="large" color="white" />
              </View>
          
          <Snackbar
            duration={20000}
            visible={this.state.driveErrorExists}
            onDismiss={() => this.setState({ driveErrorExists: false })}
          >
            {this.state.errorToShow}
          </Snackbar>
        </View>
      )
    }
  }
}

const mapStateToProps = (store) => {
  return { accessToken: store.userInfo.userInfo.accessToken }
}

export default connect(
  mapStateToProps,
  { updatePreferences, updateEntries, setPreferencesId, setEntriesId }
)(LaunchScreen)