import React, { Component } from 'react'
import { View, Keyboard, SafeAreaView } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { updatePreferences, updateEntries } from '../Redux/actions'
import { Title, Surface, TextInput, Text, HelperText, RadioButton, Button } from 'react-native-paper';
import { connect } from 'react-redux'
import DateTimePicker from 'react-native-modal-datetime-picker';

// Styles
import styles from './Styles/UserSetupScreenStyles'

class UserSetupScreen extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        const dateObject = new Date();
        const formattedMonth = (dateObject.getMonth() + 1).toString().length === 1 ? "0" + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
        const dateNumber = dateObject.getDate();
        const formattedDate = dateNumber / 10 < 1 ? "0" + dateNumber : dateNumber;
        const currentDate = dateObject.getFullYear() + "-" + formattedMonth + "-" + formattedDate;

        this.state = {
            isDateTimePickerVisible: false,
            firstName: '',
            lastName: '',
            dateOfBirth: currentDate,
            dateOfBirthError: false,
            primaryTheme: "light", //light or dark
            secondaryColor: "blue", // blue, red, orange, green, purple, or pink
            usePassword: false,
            password: '',
            showPassword: false,
        };

        this._showDateTimePicker = this._showDateTimePicker.bind(this);
        this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
        this._handleDatePicked = this._handleDatePicked.bind(this);
        this.createNewUser = this.createNewUser.bind(this);
        this.validate = this.validate.bind(this);
    }

    createNewUser(e) {
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
            DriveHelper.postFile(this.props.accessToken, userData, '0');
            DriveHelper.postFile(this.props.accessToken, { 1: [] }, '1');
            const { replace } = this.props.navigate;
            replace("DrawerNavigator");
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
        const dateObject = date;
        const formattedMonth = (dateObject.getMonth() + 1).toString().length === 1 ? "0" + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
        const dateNumber = dateObject.getDate();
        const formattedDate = dateNumber / 10 < 1 ? "0" + dateNumber : dateNumber;
        const dateString = dateObject.getFullYear() + "-" + formattedMonth + "-" + formattedDate;

        this.setState({
            dateOfBirth: dateString
        })
        this._hideDateTimePicker();
    };

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.horizontalCenter}>
                    <Title style={styles.welcomeText}>Welcome, {this.props.firstName}!</Title>
                </View>
                <View style={styles.centerContainer}>
                    <Surface style={styles.surface}>
                        <Text style={styles.titleText}>When would you like to start tallying from?</Text>
                        <TextInput
                            style={styles.dateSelector}
                            mode='outlined'
                            label='Start/Birth Date'
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
                        <Text style={styles.titleText}>Which theme do you prefer?</Text>
                        <RadioButton.Group
                            onValueChange={primaryTheme => this.setState({ primaryTheme })}
                            value={this.state.primaryTheme}
                        >
                            <View style={styles.radioGroup}>
                                <View style={styles.leftRadio}>
                                    <Text>Light</Text>
                                    <RadioButton.Android value="light" />
                                </View>
                                <View style={styles.rightRadio}>
                                    <Text>Dark</Text>
                                    <RadioButton.Android value="dark" disabled={true} />
                                </View>
                            </View>
                        </RadioButton.Group>
                    </Surface>
                    <Surface style={styles.surface}>
                        <Text style={styles.titleText}>Would you like to use a password?</Text>
                        <RadioButton.Group
                            onValueChange={usePassword => this.setState({ usePassword })}
                            value={this.state.usePassword}
                        >
                            <View style={styles.radioGroup}>
                                <View style={styles.leftRadio}>
                                    <Text>Yes</Text>
                                    <RadioButton.Android value={true} />
                                </View>
                                <View style={styles.rightRadio}>
                                    <Text>No</Text>
                                    <RadioButton.Android value={false} />
                                </View>
                            </View>
                        </RadioButton.Group>
                    </Surface>
                    <Surface style={this.state.usePassword ? styles.surface : styles.none}>
                        <Text style={styles.titleText}>What would you like your password to be?</Text>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.dateSelector}
                            mode='outlined'
                            label='Password'
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                        />
                    </Surface>
                    <Button mode="outlined" onPress={this.createNewUser}>
                        Let's Begin
                    </Button>
                </View>
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
    console.log(store.userInfo.userInfo)
    return {
        accessToken: store.userInfo.userInfo.accessToken,
        firstName: store.userInfo.userInfo.user.givenName
    }
}

export default connect(
    mapStateToProps,
    { updatePreferences, updateEntries }
)(UserSetupScreen)