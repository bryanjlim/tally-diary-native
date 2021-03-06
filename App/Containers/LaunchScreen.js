import React, { Component } from 'react';
import { Image, View, Platform } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { Snackbar } from 'react-native-paper';
import { setUserInfo } from '../Redux/actions';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

// Styles
import styles from './Styles/LaunchScreenStyles';

class LaunchScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      accessToken: null,
      showScreen: false,
      showError: false,
      errorToShow: ""
    }
  }

  componentDidMount() {
    firebase.analytics().setAnalyticsCollectionEnabled(true);
    firebase.analytics().setMinimumSessionDuration(100);
    firebase.analytics().logEvent("App_Launch")
    firebase.analytics().setCurrentScreen("Launch");

    if(Platform.OS == 'ios') {
      firebase.analytics().logEvent("iOS_User_Launch")
    } else {
      firebase.analytics().logEvent("Android_User_launch")
    }

    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.appdata'],
      webClientId: '577206274010-9oung4hgd77fij9e50kjbc32tlviai4e.apps.googleusercontent.com',
      iosClientId: '577206274010-mllq7pnu4utqp4dh12335bp50vdlt9ug.apps.googleusercontent.com',
    });

    GoogleSignin.signInSilently().then((userInfo) => {
      if (userInfo) {
        this.props.setUserInfo(userInfo)
        const { replace } = this.props.navigation;
        replace("InitialLoadingScreen");
      }
      this.setState({
        showScreen: true,
      })
    }).catch((err) => {
      this.setState({
        showScreen: true,
      })
    })
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.props.setUserInfo(userInfo)

      const { replace } = this.props.navigation;
      replace("InitialLoadingScreen");
    } catch (error) {
      console.log(error)
      this.setState({
        showError: true,
        errorToShow: "Error signing in with Google",
      })
    }
  };

  render() {
    return (
      <View style={styles.centerContainerBlue}>
        {
          this.state.showScreen ?
            <View style={styles.centerContainerBlue}>
              <View style={{ marginBottom: 20 }}>
                <Image source={require('../Images/TextLogoWhite.png')} style={{
                  width: 250,
                  resizeMode: 'contain'
                }} />
              </View>
              <View>
                <GoogleSigninButton
                  style={{ width: 192, height: 48 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Light}
                  onPress={this.signIn}
                />
              </View>
            </View> :
            <View></View>
        }
        <Snackbar
          visible={this.state.showError}
          onDismiss={() => this.setState({ showError: false })}
        >
          Error Signing In: {this.state.errorToShow}
        </Snackbar>
      </View>
    )
  }
}

export default connect(
  null,
  { setUserInfo }
)(LaunchScreen)