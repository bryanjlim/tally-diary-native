import React, { Component } from 'react'
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, } from 'react-native'
import DriveHelper from '../Helpers/driveHelper'
import TimeHelper from '../Helpers/timeHelper';
import { connect } from 'react-redux'
import { Appbar, Button, IconButton, Surface, HelperText, Chip, Title, Divider, TextInput as PaperInput } from 'react-native-paper';
import { updateEntries } from '../Redux/actions'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Dropdown } from 'react-native-material-dropdown';

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
      todos: [],
      tallyType: "",
      tallyText: "",
      isThumbsUp: false,
      isThumbsDown: false,
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
      "todos": this.state.todos,
      "isThumbsUp": this.state.isThumbsUp,
      "isThumbsDown": this.state.isThumbsDown,
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
      todos: [],
      tallyType: "",
      tallyText: "",
      isThumbsUp: false,
      isThumbsDown: false,
    })
  }

  toggleThumbsUp() {
    this.setState((prevState) => ({
      isThumbsUp: !prevState.isThumbsUp,
      isThumbsDown: false,
    }))
  }

  toggleThumbsDown() {
    this.setState((prevState) => ({
      isThumbsUp: false,
      isThumbsDown: !prevState.isThumbsDown,
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
      <SafeAreaView style={this.props.lightTheme ? styles.notchContainer : styles.notchContainerDark}>

        <Appbar style={this.props.lightTheme ? styles.appBar : styles.appBarDark}>
          <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
          <Title style={{fontSize: 20, color: 'white', marginLeft: 15,}}>Add Entry</Title>
        </Appbar>

        <ScrollView style={this.props.lightTheme ? styles.mainContainer : styles.mainContainerDark}>
          <View style={this.props.lightTheme ? styles.centerContainer : styles.centerContainerDark}>
            <Surface style={this.props.lightTheme ? styles.surface : styles.surfaceDark}>

              {/* Header */}
              <Title style={this.props.lightTheme ? styles.dayLabel : styles.dayLabelDark}>Day {dayNumber}</Title>
              <TouchableOpacity
                onPress={() => { this._showDateTimePicker(); }}
                style={this.props.lightTheme ? styles.inputDate : styles.inputDateDark}
              >
                <Text style={this.props.lightTheme ? {} : {color: 'white'}}>
                  {this.state.date}
                </Text>
              </TouchableOpacity>
              <TextInput
                placeholder="Title (Optional)"
                value={this.state.title}
                onChangeText={(title) => this.setState({ title })}
                style={this.props.lightTheme ? styles.inputTitle : styles.inputTitleDark}
                placeholderTextColor={this.props.lightTheme ? 'lightgray' : 'darkgray'}
              />

              <Divider style={styles.topDivider} />

              {/* Paragraph Entry */}
              <Title style={this.props.lightTheme ? styles.tallyTitle : styles.tallyTitleDark}>Your Thoughts</Title>
              <PaperInput
                theme={this.props.lightTheme ? { colors: { primary: Colors.blue } } : { colors: { primary: 'white', text: 'white', placeholder: 'white' } }}
                selectionColor={Colors.blue}
                underlineColor={Colors.blue}
                mode="outlined"
                style={this.props.lightTheme ? styles.bodyText : styles.bodyTextDark}
                multiline={true}
                value={this.state.bodyText}
                onChangeText={(bodyText) => this.setState({ bodyText })}
              />

              <Divider />

              {/* Thumbs */}
              <Title style={this.props.lightTheme ? styles.tallyTitle : styles.tallyTitleDark}>Rate Your Day</Title>
              <View style={styles.row}>
                {this.state.isThumbsUp ?
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
                {this.state.isThumbsDown ?
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

              <Divider />

              {/* Tally Entry */}
              <Title style={this.props.lightTheme ? styles.tallyTitle : styles.tallyTitleDark}>Tallies</Title>
              <View style={styles.tallyRow}>
                <View style={styles.dropdownMenu}>
                  <Dropdown
                    label='Category'
                    data={categories}
                    value={this.state.tallyType}
                    baseColor={this.props.lightTheme ? "black" : "white"}
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

              <Divider />

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

      </SafeAreaView>
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