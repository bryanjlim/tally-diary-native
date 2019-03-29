import React, { Component } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { connect } from 'react-redux'
import { Appbar, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import LargeEntryCard from '../Components/LargeEntryCard'
import { updateEntries, updatePreferences } from '../Redux/actions'
import Icon from 'react-native-vector-icons/MaterialIcons'
import UpdateEntryScreen from './UpdateEntryScreen';

// Styles
import styles from './Styles/TimelineScreenStyles'
import Colors from '../Themes/Colors'

class TimelineSreen extends Component {

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon
        name="library-books"
        style={{ color: tintColor, marginLeft: -5, fontSize: 32 }}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.assignIndexes(); // Important: keep index values to diary entries up to date locally

    this.state = {
      modalVisible: false,
      diaryEntryToDelete: "None",
      showDiaryEntry: false,
      diaryEntryToShowIndex: "None",
    }

    this.eachDiaryEntryObject = this.eachDiaryEntryObject.bind(this);
    this.assignIndexes = this.assignIndexes.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.updateEntry = this.updateEntry.bind(this);
    this._showDialog = this._showDialog.bind(this);
    this._hideDialog = this._hideDialog.bind(this);
  }

  eachDiaryEntryObject(entry) {
    return (
      <View style={{ alignItems: 'center' }}>
        <LargeEntryCard entry={entry} birthDate={this.props.preferences.dateOfBirth}
          delete={() => {
            this.setState({ diaryEntryToDelete: entry.index });
            this._showDialog()
          }}
          view={() => {
            this.setState({
              showDiaryEntry: true,
              diaryEntryToShowIndex: entry.index,
            })
          }} />
      </View>
    );
  }

  updateEntry(updatedEntry, index) {
    let entriesArray = [];
    for (let i = 0; i < this.props.entries.length; i++) {
      entriesArray[i] = this.props.entries[i];
    }

    entriesArray[index] = updatedEntry;
    DriveHelper.patchFile(this.props.accessToken, entriesArray, "1", this.props.entriesId);
    this.setState({
      showDiaryEntry: false,
      diaryEntryToShowIndex: "None",
    });
    this.props.updateEntries(entriesArray);
  }

  deleteEntry() {
    if (this.state.diaryEntryToDelete != "None") {
      let entriesArray = [];
      for (let i = 0; i < this.props.entries.length; i++) {
        entriesArray[i] = this.props.entries[i];
      }

      const index = this.state.diaryEntryToDelete;
      entriesArray.splice(index, 1);
      DriveHelper.patchFile(this.props.accessToken, entriesArray, "1", this.props.entriesId);
      this.setState({
        diaryEntryToDelete: "None",
      })
      this._hideDialog();
      this.forceUpdate();
      this.props.updateEntries(entriesArray);
    }
  }

  assignIndexes() {
    let entriesArray = [];
    for (let i = 0; i < this.props.entries.length; i++) {
      entriesArray[i] = this.props.entries[i];
      entriesArray[i].index = i;
    }
    this.props.updateEntries(entriesArray);
  }

  _showDialog = () => this.setState({ modalVisible: true });

  _hideDialog = () => this.setState({ modalVisible: false });

  render() {
    return (
      <SafeAreaView style={styles.notchContainer}>

        {this.state.showDiaryEntry ?
          <UpdateEntryScreen entry={this.props.entries[this.state.diaryEntryToShowIndex]}
            updateEntry={(entry) => this.updateEntry(entry, this.state.diaryEntryToShowIndex)}
            preferences={this.props.preferences}
            />
          :
          <View>
            <Appbar style={styles.appBar}>
              <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
            </Appbar>

            <Portal>
              <Dialog
                visible={this.state.modalVisible}
                onDismiss={this._hideDialog}>
                <Dialog.Title>Confirm Deletion</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>This cannot be undone</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button color={Colors.blue} onPress={() => this.deleteEntry()}>Confirm</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>

            <ScrollView>
              <View style={styles.mainContainer}>
                {this.props.entries instanceof Array && this.props.entries.length > 0 ?
                  this.props.entries.map(this.eachDiaryEntryObject) :
                  <View style={styles.centerContainer}>
                    <Text style={{ marginTop: 10 }}>No Diary Entries To Show</Text>
                  </View>
                }

              </View>
            </ScrollView>
          </View>
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (store) => {
  const entries = store.entries;
  const preferences = store.preferences;
  const accessToken = store.userInfo.userInfo.accessToken;
  const entriesId = store.userInfo.entriesId;
  return { entries, preferences, accessToken, entriesId };
}

export default connect(
  mapStateToProps,
  { updateEntries, updatePreferences }
)(TimelineSreen)