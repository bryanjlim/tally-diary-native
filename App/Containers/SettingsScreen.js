import React, { Component } from 'react'
import { View, ScrollView, Keyboard, SafeAreaView } from 'react-native'
import DriveHelper from '../Helpers/driveHelper'
import TimeHelper from '../Helpers/timeHelper';
import { updatePreferences } from '../Redux/actions'
import { Appbar, Surface, TextInput, Text, HelperText, RadioButton, Button, Title } from 'react-native-paper';
import { GoogleSignin } from 'react-native-google-signin'
import { connect } from 'react-redux'
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'

// Styles
import styles from './Styles/SettingsScreenStyles'
import Colors from '../Themes/Colors'

class SettingsScreen extends Component {

    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
          <Icon
            name="settings"
            style={{ color: tintColor, marginLeft: -5, fontSize: 32 }}
          />
        ),
    };

    constructor(props) {
        super(props);

        this.state = {
            isDateTimePickerVisible: false,
            firstName: this.props.preferences.firstName,
            lastName: this.props.preferences.lastName,
            dateOfBirth: this.props.preferences.dateOfBirth,
            dateOfBirthError: false,
            primaryTheme: this.props.preferences.primaryTheme, //light or dark
            secondaryColor: this.props.preferences.secondaryColor, // blue, red, orange, green, purple, or pink
            usePassword: this.props.preferences.usePassword,
            password: this.props.preferences.password,
        };

        this._showDateTimePicker = this._showDateTimePicker.bind(this);
        this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
        this._handleDatePicked = this._handleDatePicked.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.validate = this.validate.bind(this);
    }

    updateUser(e) {
        e.preventDefault();

        if (!this.state.usePassword) {
            this.setState({ password: '' });
        }

        if (this.validate()) {
            const userData = {
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "dateOfBirth": this.state.dateOfBirth,
                "appLaunches": this.props.preferences.appLaunches,
                "primaryTheme": this.state.primaryTheme,
                "secondaryColor": this.state.secondaryColor,
                "usePassword": this.state.usePassword,
                "password": this.state.password,
            };
            DriveHelper.patchFile(this.props.accessToken, userData, '0', this.props.preferencesId);
            this.props.updatePreferences(userData)
            // TODO: Snackbar showing success or failure
        }
    }

    validate() {
        if(this.state.dateOfBirth === '') {
            this.setState({dateOfBirthError: true});
            return false;
        } else {
            if(new Date(this.state.dateOfBirth) < new Date()) {
                this.setState({dateOfBirthError: false});
                return true;
            }
            this.setState({dateOfBirthError: true});
            return false;
        }
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        const dateString = TimeHelper.getReadableDate(date)

        this.setState({
            dateOfBirth: dateString
        })
        this._hideDateTimePicker();
    };

    render() {
        const { replace } = this.props.navigation;
        return (
            <SafeAreaView style={this.props.lightTheme ? styles.notchContainer : styles.notchContainerDark}>

                <Appbar style={this.props.lightTheme ? styles.appBar : styles.appBarDark}>
                    <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
                    <Title style={{fontSize: 20, color: 'white', marginLeft: 15,}}>Settings</Title>
                </Appbar>

                <ScrollView style={this.props.lightTheme ? styles.mainContainer : styles.mainContainerDark}>
                    <View style={this.props.lightTheme ? styles.centerContainer : styles.centerContainerDark}>
                        <Surface style={this.props.lightTheme ? styles.topSurface : styles.topSurfaceDark}>
                            <Title style={this.props.lightTheme ? styles.titleText : styles.titleTextDark}>Account Actions</Title>
                            <Button style={styles.signOutButton} 
                                    mode="outlined" 
                                    color={this.props.lightTheme ? Colors.blue : 'white'}
                                    onPress={() => {GoogleSignin.signOut(); replace("LaunchScreen")}}>
                                Sign Out
                            </Button>
                        </Surface>
                        <Surface style={this.props.lightTheme ? styles.surface : styles.surfaceDark}>
                            <Title style={this.props.lightTheme ? styles.titleText : styles.titleTextDark}>Update Start Date</Title>
                            <TextInput
                                style={this.props.lightTheme ? styles.dateSelector : styles.dateSelectorDark}
                                mode='outlined'
                                value={this.state.dateOfBirth}
                                onFocus={() => { Keyboard.dismiss(); this._showDateTimePicker(); }}
                                theme={this.props.lightTheme ? { } : { colors: { primary: 'white', text: 'white', placeholder: 'white' } }}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.dateOfBirthError}
                                >
                                Start date is invalid (cannot be in the future)
                            </HelperText>
                        </Surface>
                        <Surface style={this.props.lightTheme ? styles.surface : styles.surfaceDark}>
                            <Title style={this.props.lightTheme ? styles.titleText : styles.titleTextDark}>Update Theme</Title>
                            <RadioButton.Group
                                onValueChange={primaryTheme => this.setState({ primaryTheme })}
                                value={this.state.primaryTheme}
                            >
                                <View style={styles.radioGroup}>
                                    <View style={styles.leftRadio}>
                                        <Text style={this.props.lightTheme ? {} : {color: 'white'}}>Light</Text>
                                        <RadioButton.Android color={this.props.lightTheme ? Colors.blue : Colors.teal} value="light" />
                                    </View>
                                    <View style={styles.rightRadio}>
                                        <Text style={this.props.lightTheme ? {} : {color: 'white'}}>Dark</Text>
                                        <RadioButton.Android color={this.props.lightTheme ? Colors.blue : Colors.teal} value="dark" />
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </Surface>
                        <Surface style={this.props.lightTheme ? styles.surface : styles.surfaceDark}>
                            <Title style={this.props.lightTheme ? styles.titleText : styles.titleTextDark}>Use Password?</Title>
                            <RadioButton.Group
                                onValueChange={usePassword => this.setState({ usePassword })}
                                value={this.state.usePassword}
                            >
                                <View style={styles.radioGroup}>
                                    <View style={styles.leftRadio}>
                                        <Text style={this.props.lightTheme ? {} : {color: 'white'}}>Yes</Text>
                                        <RadioButton.Android color={this.props.lightTheme ? Colors.blue : Colors.teal} value={true} />
                                    </View>
                                    <View style={styles.rightRadio}>
                                        <Text style={this.props.lightTheme ? {} : {color: 'white'}}>No</Text>
                                        <RadioButton.Android color={this.props.lightTheme ? Colors.blue : Colors.teal} value={false} />
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </Surface>
                        <Surface style={this.state.usePassword ? (this.props.lightTheme ? styles.surface : styles.surfaceDark) : styles.none}>
                            <Title style={this.props.lightTheme ? styles.titleText : styles.titleTextDark}>Set Password</Title>
                            <TextInput
                                secureTextEntry={true}
                                style={this.props.lightTheme ? styles.dateSelector : styles.dateSelectorDark}
                                mode='outlined'
                                label='Password'
                                value={this.state.password}
                                onChangeText={password => this.setState({ password })}
                                theme={this.props.lightTheme ? { } : { colors: { primary: 'white', text: 'white', placeholder: 'white' } }}
                            />
                        </Surface>
                        <Button mode="outlined" color={this.props.lightTheme ? Colors.blue : Colors.teal} onPress={this.updateUser} 
                            style={this.props.lightTheme ? styles.submitButton : styles.submitButtonDark}>
                            Update Settings
                        </Button>
                    </View>
                </ScrollView>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        lightTheme: store.preferences.primaryTheme == "light",
        accessToken: store.userInfo.userInfo.accessToken,
        preferencesId: store.userInfo.preferencesId,
        preferences: store.preferences,
    }
}

export default connect(
    mapStateToProps,
    { updatePreferences }
)(SettingsScreen)