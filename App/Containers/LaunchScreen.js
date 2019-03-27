import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'
import { setUserInfo } from '../Redux/actions'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      accessToken: null,
    }
  }

  componentDidMount() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.appdata'],
      webClientId: '577206274010-1sn8lb9fvd0a7m3rof6r19drhtvk20nm.apps.googleusercontent.com',
      iosClientId: '577206274010-mllq7pnu4utqp4dh12335bp50vdlt9ug.apps.googleusercontent.com',
    });
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.props.setUserInfo(userInfo)

      const { replace } = this.props.navigation;
      replace("InitialLoadingScreen");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  render() {
    return (
      <View style={styles.centerContainer}>
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
        />
      </View>
    )
  }
}

export default connect(
  null,
  { setUserInfo }
)(LaunchScreen)