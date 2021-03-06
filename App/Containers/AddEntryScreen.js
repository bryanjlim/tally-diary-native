import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import DriveHelper from '../Helpers/driveHelper';
import TimeHelper from '../Helpers/timeHelper';
import { connect } from 'react-redux';
import { Appbar, Button, IconButton, Surface, Chip, Title, Divider, Snackbar, TextInput as PaperInput } from 'react-native-paper';
import { updateEntries } from '../Redux/actions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Dropdown } from 'react-native-material-dropdown';
import firebase from 'react-native-firebase';

// Styles
import styles from './Styles/AddEntryScreenStyles'
import Colors from '../Themes/Colors'

class AddEntryScreen extends Component {

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <MaterialIcon
        name="add"
        style={{ color: tintColor, marginLeft: -5, fontSize: 32 }}
      />
    ),
  };

  constructor(props) {
    super(props);
    const currentDate = TimeHelper.getReadableDate(new Date());
    this.state = {
      isDateTimePickerVisible: false,
      title: "",
      date: currentDate,
      bodyText: "",
      tallies: [],
      tallyType: "",
      tallyText: "",
      isThumbUp: false,
      isThumbDown: false,
      showSuccess: false,
      bodyTouched: false,
    }

    this._showDateTimePicker = this._showDateTimePicker.bind(this);
    this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
    this._handleDatePicked = this._handleDatePicked.bind(this);
    this.addTally = this.addTally.bind(this);
    this.toggleThumbsUp = this.toggleThumbsUp.bind(this);
    this.toggleThumbsDown = this.toggleThumbsDown.bind(this);
    this.deleteTally = this.deleteTally.bind(this);
    this.submitEntry = this.submitEntry.bind(this);
  }

  componentDidMount(){
    firebase.analytics().setCurrentScreen("Add Entry");
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    const readableDate = TimeHelper.getReadableDate(date);
    this.setState({
      date: readableDate
    });
    this._hideDateTimePicker();
  };

  addTally() {
    if (this.state.tallyType != "" && this.state.tallyText != "") {
      this.setState(prevState => ({
        tallies: [...prevState.tallies, { type: this.state.tallyType, text: this.state.tallyText }],
        tallyType: '',
        tallyText: '',
      }))
    }
  }

  deleteTally(index) {
    const array = [...this.state.tallies];
    array.splice(index, 1);
    this.setState({ tallies: array })
  }

  submitEntry() {
    firebase.analytics().logEvent("User_Wrote_Entry")
    let entries = [];
    for (let i = 0; i < this.props.entries.length; i++) {
      entries[i] = this.props.entries[i];
    }

    if (!(this.props.entries instanceof Array)) {
      entries = [];
    }
    entries.push({
      "title": this.state.title,
      "date": this.state.date,
      "bodyText": this.state.bodyText,
      "tallies": this.state.tallies,
      "isThumbUp": this.state.isThumbUp,
      "isThumbDown": this.state.isThumbDown,
    });

    entries.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })

    DriveHelper.patchFile(this.props.accessToken, entries, "1", this.props.entriesId);
    this.props.updateEntries(entries);

    // Reset this page
    const currentDate = TimeHelper.getReadableDate(new Date());
    this.setState({
      isDateTimePickerVisible: false,
      title: "",
      date: currentDate,
      bodyText: "",
      tallies: [],
      tallyType: "",
      tallyText: "",
      isThumbUp: false,
      isThumbDown: false,
      showSuccess: false,
    })

    this.setState({
      showSuccess: true,
    })
  }

  toggleThumbsUp() {
    this.setState((prevState) => ({
      isThumbUp: !prevState.isThumbUp,
      isThumbDown: false,
    }))
  }

  toggleThumbsDown() {
    this.setState((prevState) => ({
      isThumbUp: false,
      isThumbDown: !prevState.isThumbDown,
    }))
  }

  render() {
    let categories = [{
      value: 'Food',
    }, {
      value: 'Activity',
    }, {
      value: 'Location',
    }, {
      value: 'Person',
    }, {
      value: 'Other',
    }];

    const dayNumber = TimeHelper.calculateDayDifference(new Date(this.props.preferences.dateOfBirth),
      new Date(this.state.date));

    return (
      <KeyboardAvoidingView behavior={Platform.OS == "android" ? "" : "padding"}
        keyboardVerticalOffset={Platform.OS == "android" ? 0 : 50}>
        <SafeAreaView style={this.props.lightTheme ? styles.notchContainer : styles.notchContainerDark}>

          <Appbar style={this.props.lightTheme ? styles.appBar : styles.appBarDark}>
            <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
            <Title style={{ fontSize: 20, color: 'white', marginLeft: 15, }}>Add Entry</Title>
          </Appbar>

          <ScrollView style={this.props.lightTheme ? styles.mainContainer : styles.mainContainerDark}>
            <View style={this.props.lightTheme ? styles.centerContainer : styles.centerContainerDark}>
              <Surface style={this.props.lightTheme ? styles.surface : styles.surfaceDark}>

                {/* Header */}
                <View style={styles.row}>
                  <View style={styles.titleWrapper}>
                    <Title style={this.props.lightTheme ? styles.dayLabel : styles.dayLabelDark}>Day {dayNumber}</Title>
                  </View>
                  <View style={styles.dateWrapper}>
                    <TouchableOpacity
                      onPress={() => { this._showDateTimePicker(); }}
                      style={this.props.lightTheme ? styles.inputDate : styles.inputDateDark}
                    >
                      <Text style={this.props.lightTheme ? {} : { color: 'white' }}>
                        {this.state.date}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  placeholder="Title (Optional)"
                  value={this.state.title}
                  onChangeText={(title) => this.setState({ title })}
                  style={this.props.lightTheme ? styles.inputTitle : styles.inputTitleDark}
                  placeholderTextColor={this.props.lightTheme ? 'lightgray' : 'darkgray'}
                />

                <Divider style={this.props.lightTheme ? styles.topDivider : styles.topDividerDark} />

                {/* Paragraph Entry */}
                <Title style={this.props.lightTheme ? styles.tallyTitle : styles.tallyTitleDark}>Your Thoughts</Title>
                <PaperInput
                  theme={this.props.lightTheme ?
                    this.state.bodyTouched ? { colors: { placeholder: 'white', primary: 'white' } } :
                      { colors: { placeholder: 'black', primary: 'white' } } :
                    this.state.bodyTouched ?
                      { colors: { primary: Colors.surfaceDark, text: 'white', placeholder: Colors.surfaceDark } } :
                      { colors: { primary: Colors.surfaceDark, text: 'white', placeholder: 'white' } }}
                  mode="outlined"
                  selectionColor={Colors.blue}
                  underlineColor={Colors.blue}
                  style={this.props.lightTheme ? styles.bodyText : styles.bodyTextDark}
                  multiline={true}
                  value={this.state.bodyText}
                  onTouchEnd={() => this.setState({ bodyTouched: this.state.bodyText != "" })}
                  onChangeText={(bodyText) => this.setState({ bodyText, bodyTouched: bodyText != '' })}
                />
                <Divider style={this.props.lightTheme ? styles.divider : styles.dividerDark} />

                {/* Thumbs */}
                <Title style={this.props.lightTheme ? styles.tallyTitle : styles.tallyTitleDark}>Rate Your Day</Title>
                <View style={styles.row}>
                  {this.state.isThumbUp ?
                    <Icon.Button
                      name="thumb-up"
                      onPress={this.toggleThumbsUp}
                      iconStyle={this.props.lightTheme ? { color: 'black', backgroundColor: 'white' } :
                        { color: 'white', backgroundColor: Colors.surfaceDark }}
                      backgroundColor={this.props.lightTheme ? "white" : Colors.surfaceDark}
                      style={styles.thumbButton}
                    /> :
                    <Icon.Button
                      name="thumb-up-outline"
                      onPress={this.toggleThumbsUp}
                      iconStyle={this.props.lightTheme ? { color: 'black', backgroundColor: 'white' } :
                        { color: 'white', backgroundColor: Colors.surfaceDark }}
                      backgroundColor={this.props.lightTheme ? "white" : Colors.surfaceDark}
                      style={styles.thumbButton}
                    />}
                  {this.state.isThumbDown ?
                    <Icon.Button
                      name="thumb-down"
                      onPress={this.toggleThumbsDown}
                      iconStyle={this.props.lightTheme ? { color: 'black', backgroundColor: 'white' } :
                        { color: 'white', backgroundColor: Colors.surfaceDark }}
                      backgroundColor={this.props.lightTheme ? "white" : Colors.surfaceDark}
                      style={styles.thumbButton}
                    /> :
                    <Icon.Button
                      name="thumb-down-outline"
                      onPress={this.toggleThumbsDown}
                      iconStyle={this.props.lightTheme ? { color: 'black', backgroundColor: 'white' } :
                        { color: 'white', backgroundColor: Colors.surfaceDark }}
                      backgroundColor={this.props.lightTheme ? "white" : Colors.surfaceDark}
                      style={styles.thumbButton}
                    />}
                </View>

                <Divider style={this.props.lightTheme ? styles.divider : styles.dividerDark} />

                {/* Tally Entry */}
                <Title style={this.props.lightTheme ? styles.tallyTitle : styles.tallyTitleDark}>Tallies</Title>
                <View style={styles.tallyRow}>
                  <View style={styles.dropdownMenu}>
                    <Dropdown
                      label='Category'
                      data={categories}
                      value={this.state.tallyType}
                      baseColor={this.props.lightTheme ? "black" : "white"}
                      textColor={this.props.lightTheme ? "black" : "white"}
                      itemColor={this.props.lightTheme ? "black" : "white"}
                      animationDuration={0}
                      rippleCentered={true}
                      pickerStyle={this.props.lightTheme ? {} : { backgroundColor: Colors.backgroundDark }}
                      onChangeText={(tallyType) => { this.setState({ tallyType }) }}
                    />
                  </View>
                  <TextInput
                    style={this.props.lightTheme ? styles.tallyTextInput : styles.tallyTextInputDark}
                    value={this.state.tallyText}
                    onChangeText={(tallyText) => this.setState({ tallyText })}
                  />
                  <IconButton
                    style={styles.addTallyButton}
                    icon="add"
                    color={this.props.lightTheme ? Colors.blue : Colors.teal}
                    size={35}
                    onPress={this.addTally}
                  />
                </View>

                {/* Tally View */}
                <View style={styles.tallyChipContainer}>
                  {this.state.tallies.map((value, index) => {
                    return (
                      <View style={styles.tallyChip}>
                        <Chip onClose={() => { this.deleteTally(index) }}>
                          {value.type} | {value.text}
                        </Chip>
                      </View>
                    );
                  })}
                </View>

                <Divider style={this.props.lightTheme ? styles.divider : styles.dividerDark} />

                {/* Submit */}
                <Button
                  color={this.props.lightTheme ? Colors.blue : 'white'}
                  theme={this.props.lightTheme ? {} : { colors: { primary: 'white', text: 'white' } }}
                  onPress={this.submitEntry}
                  mode="outlined"
                  style={this.props.lightTheme ? styles.submitButton : styles.submitButtonDark}>
                  Add Entry
              </Button>

              </Surface>
            </View>
          </ScrollView>

          <DateTimePicker
            date={new Date(this.state.date)}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />

          <Snackbar
            visible={this.state.showSuccess}
            onDismiss={() => this.setState({ showSuccess: false })}
            duration={4000}
            action={{
              label: 'Ok',
              onPress: () => { },
            }}
            style={{ bottom: 100, }}
          >
            Diary Entry Added
        </Snackbar>

        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (store) => {
  const lightTheme = store.preferences.primaryTheme == "light";
  const accessToken = store.userInfo.userInfo.accessToken;
  const entries = store.entries;
  const preferences = store.preferences;
  const entriesId = store.userInfo.entriesId;
  return { entries, preferences, entriesId, accessToken, lightTheme };
}

export default connect(
  mapStateToProps,
  { updateEntries }
)(AddEntryScreen)