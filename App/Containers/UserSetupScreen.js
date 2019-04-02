import React, { Component } from 'react'
import { View, Keyboard, SafeAreaView, ScrollView } from 'react-native'
import DriveHelper from '../Helpers/driveHelper'
import TimeHelper from '../Helpers/timeHelper'
import { updatePreferences, updateEntries } from '../Redux/actions'
import { Title, Surface, TextInput, Text, HelperText, RadioButton, Button } from 'react-native-paper';
import { connect } from 'react-redux'
import DateTimePicker from 'react-native-modal-datetime-picker';

// Styles
import styles from './Styles/UserSetupScreenStyles'
import Colors from '../Themes/Colors'

class UserSetupScreen extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        const currentDate = TimeHelper.formatDate(new Date());

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
            this.props.updatePreferences(userData);
            const { replace } = this.props.navigation;
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
        const dateString = TimeHelper.formatDate(date)
        this.setState({
            dateOfBirth: dateString
        })
        this._hideDateTimePicker();
    };

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView>
                <View style={styles.horizontalCenter}>
                    <Title style={styles.welcomeText}>Welcome, {this.props.firstName}!</Title>
                </View>
                <View style={styles.horizontalCenter}>
                    <Surface style={styles.surface}>
                        <Title style={styles.titleText}>When would you like to start tallying from?</Title>
                        <HelperText style={{paddingBottom: 7}}>We recommend using your date of birth</HelperText>
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
                        <Title style={styles.titleText}>Which theme would you like to use?</Title>
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
                        <Title style={styles.titleText}>Would you like to use a password?</Title>
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
                        <Title style={styles.titleText}>What would you like your password to be?</Title>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.dateSelector}
                            mode='outlined'
                            label='Password'
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                            theme={{colors: { primary: Colors.blue }}}
                        />
                    </Surface>
                    <Button mode="outlined" onPress={this.createNewUser} color={Colors.blue}> 
                        Let's Begin
                    </Button>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                </ScrollView>
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