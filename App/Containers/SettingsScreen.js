import React, { Component } from 'react'
import { View, ScrollView, Keyboard, SafeAreaView } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import TimeHelper from '../Helpers/timeHelper';
import { updatePreferences } from '../Redux/actions'
import { Appbar, Surface, TextInput, Text, HelperText, RadioButton, Button } from 'react-native-paper';
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
                "appLaunches": 1,
                "primaryTheme": this.state.primaryTheme,
                "secondaryColor": this.state.secondaryColor,
                "usePassword": this.state.usePassword,
                "password": this.state.password,
            };
            DriveHelper.patchFile(this.props.accessToken, userData, '0', this.props.preferencesId);
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
            <SafeAreaView style={styles.notchContainer}>
                <Appbar style={styles.appBar}>
                    <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
                </Appbar>
                <ScrollView style={styles.mainContainer}>
                    <View style={styles.centerContainer}>
                        <Surface style={styles.surface}>
                            <Text style={styles.titleText}>Account Actions</Text>
                            <Button style={styles.signOutButton} mode="outlined" color={Colors.blue}
                                    onPress={() => {GoogleSignin.signOut(); replace("LaunchScreen")}}>
                                Sign Out
                            </Button>
                        </Surface>
                        <Surface style={styles.surface}>
                            <Text style={styles.titleText}>Update Start Date</Text>
                            <TextInput
                                style={styles.dateSelector}
                                mode='outlined'
                                value={this.state.dateOfBirth}
                                onFocus={() => { Keyboard.dismiss(); this._showDateTimePicker(); }}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.dateOfBirthError}
                                >
                                Start date is invalid (cannot be in the future)
                            </HelperText>
                        </Surface>
                        <Surface style={styles.surface}>
                            <Text style={styles.titleText}>Update Theme</Text>
                            <RadioButton.Group
                                onValueChange={primaryTheme => this.setState({ primaryTheme })}
                                value={this.state.primaryTheme}
                            >
                                <View style={styles.radioGroup}>
                                    <View style={styles.leftRadio}>
                                        <Text>Light</Text>
                                        <RadioButton.Android color={Colors.blue} value="light" />
                                    </View>
                                    <View style={styles.rightRadio}>
                                        <Text>Dark</Text>
                                        <RadioButton.Android color={Colors.blue} value="dark" />
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </Surface>
                        <Surface style={styles.surface}>
                            <Text style={styles.titleText}>Use Password?</Text>
                            <RadioButton.Group
                                onValueChange={usePassword => this.setState({ usePassword })}
                                value={this.state.usePassword}
                            >
                                <View style={styles.radioGroup}>
                                    <View style={styles.leftRadio}>
                                        <Text>Yes</Text>
                                        <RadioButton.Android color={Colors.blue} value={true} />
                                    </View>
                                    <View style={styles.rightRadio}>
                                        <Text>No</Text>
                                        <RadioButton.Android color={Colors.blue} value={false} />
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </Surface>
                        <Surface style={this.state.usePassword ? styles.surface : styles.none}>
                            <Text style={styles.titleText}>Set Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.dateSelector}
                                mode='outlined'
                                label='Password'
                                value={this.state.password}
                                onChangeText={password => this.setState({ password })}
                            />
                        </Surface>
                        <Button mode="outlined" color={Colors.blue} onPress={this.updateUser} style={styles.submitButton}>
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