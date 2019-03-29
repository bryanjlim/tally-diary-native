import React, { Component } from 'react'
import { SafeAreaView, ScrollView, Text, View, TextInput, Keyboard, } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
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
    for(let i = 0; i < this.props.entries.length; i++) {
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
      <SafeAreaView style={styles.notchContainer}>

        <Appbar style={styles.appBar}>
          <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar>

        <ScrollView style={styles.mainContainer}>
          <View style={styles.centerContainer}>
            <Surface style={styles.surface}>

              {/* Header */}
              <View style={styles.row}>
                <View style={styles.labelUnderline}>
                  <Text style={styles.dayLabel}>Day {dayNumber}</Text>
                </View>
                <TextInput
                  label="Title"
                  value={this.state.title}
                  onChangeText={(title) => this.setState({ title })}
                  style={styles.inputTitle}
                />
              </View>
              <View style={styles.dateUnderline}>
                <Text style={styles.dateLabel} onPress={() => { Keyboard.dismiss(); this._showDateTimePicker(); }}>
                  {this.state.date}
                </Text>
              </View>

              <Divider />

              {/* Paragraph Entry */}
              <Title style={styles.tallyTitle}>Your Thoughts</Title>
              <PaperInput
                theme={{ colors: { primary: Colors.blue } }}
                selectionColor={Colors.blue}
                underlineColor={Colors.blue}
                mode="outlined"
                style={styles.bodyText}
                multiline={true}
                value={this.state.bodyText}
                onChangeText={(bodyText) => this.setState({ bodyText })}
              />

              <Divider />

              {/* Thumbs */}
              <Title style={styles.tallyTitle}>Rate Your Day</Title>
              <View style={styles.row}>
                {this.state.isThumbsUp ?
                  <Icon.Button
                    name="thumb-up"
                    onPress={this.toggleThumbsUp}
                    iconStyle={{ color: 'black', backgroundColor: 'white' }}
                    backgroundColor="white"
                    style={styles.thumbButton}
                  /> :
                  <Icon.Button
                    name="thumb-up-outline"
                    onPress={this.toggleThumbsUp}
                    iconStyle={{ color: 'black', backgroundColor: 'white' }}
                    backgroundColor="white"
                    style={styles.thumbButton}
                  />}
                {this.state.isThumbsDown ?
                  <Icon.Button
                    name="thumb-down"
                    onPress={this.toggleThumbsDown}
                    iconStyle={{ color: 'black', backgroundColor: 'white' }}
                    backgroundColor="white"
                    style={styles.thumbButton}
                  /> :
                  <Icon.Button
                    name="thumb-down-outline"
                    onPress={this.toggleThumbsDown}
                    iconStyle={{ color: 'black', backgroundColor: 'white' }}
                    backgroundColor="white"
                    style={styles.thumbButton}
                  />}
              </View>

              <Divider />

              {/* Tally Entry */}
              <Title style={styles.tallyTitle}>Tallies</Title>
              <View style={styles.tallyRow}>
                <View style={styles.dropdownMenu}>
                  <Dropdown
                    label='Category'
                    data={categories}
                    value={this.state.tallyType}
                    onChangeText={(tallyType) => { this.setState({ tallyType }) }}
                  />
                </View>
                <PaperInput
                  theme={{ colors: { primary: Colors.blue } }}
                  selectionColor={Colors.blue}
                  underlineColor="lightgray"
                  style={styles.tallyTextInput}
                  value={this.state.tallyText}
                  onChangeText={(tallyText) => this.setState({ tallyText })}
                />
                <IconButton
                  style={styles.addTallyButton}
                  icon="add"
                  color={Colors.blue}
                  size={30}
                  onPress={this.addTally}
                />
              </View>

              {/* Tally View */}
              <View style={styles.tallyChipContainer}>
                {this.state.tallies.map((value, index) => {
                  return (
                    <View style={styles.tallyChip}>
                      <Chip onClose={() => { this.deleteTally(index) }}>{value.type} | {value.text}</Chip>
                    </View>
                  );
                })}
              </View>

              <Divider />

              {/* Submit */}
              <Button
                theme={{ colors: { primary: Colors.blue } }}
                onPress={this.submitEntry}
                mode="outlined"
                style={styles.submitButton}>
                Add Entry
              </Button>

            </Surface>
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
  const accessToken = store.userInfo.userInfo.accessToken;
  const entries = store.entries;
  const preferences = store.preferences;
  const entriesId = store.userInfo.entriesId;
  return { entries, preferences, entriesId, accessToken };
}

export default connect(
  mapStateToProps,
  { updateEntries }
)(AddEntryScreen)