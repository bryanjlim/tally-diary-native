import React, { Component } from 'react'
import { SafeAreaView, ScrollView, Text, View, ActivityIndicator } from 'react-native'
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

    let moreToShow = false;
    let diaryEntriesToShow = this.props.entries;
    if (this.props.entries instanceof Array && this.props.entries.length > 0) {
      if (this.props.entries.length > 15) {
        moreToShow = true;
      }
      diaryEntriesToShow = this.props.entries.splice(0, 16)
    }

    this.state = {
      modalVisible: false,
      diaryEntryToDelete: "None",
      showDiaryEntry: false,
      diaryEntryToShowIndex: "None",
      totalEntriesShowing: 15,
      moreToShow: moreToShow,
      diaryEntriesToShow: diaryEntriesToShow,
    }

    this.eachDiaryEntryObject = this.eachDiaryEntryObject.bind(this);
    this.assignIndexes = this.assignIndexes.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.updateEntry = this.updateEntry.bind(this);
    this._showDialog = this._showDialog.bind(this);
    this._hideDialog = this._hideDialog.bind(this);
    this.isCloseToBottom = this.isCloseToBottom.bind(this);
    this.loadMoreEntries = this.loadMoreEntries.bind(this);
  }

  eachDiaryEntryObject(entry) {
    return (
      <View style={{ alignItems: 'center' }}>
        <LargeEntryCard entry={entry} birthDate={this.props.preferences.dateOfBirth} lightTheme={this.props.lightTheme}
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

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y
      >= contentSize.height - 50;
  }

  loadMoreEntries() {
    const currentIndex = this.state.totalEntriesShowing + 1;

    let maxIndex = currentIndex + 15;
    if (this.props.entries.length < maxIndex) {
      maxIndex = this.props.entries.length;
    }

    for (let i = currentIndex; i < currentIndex + 15; i++) {
      this.setState((prevState) => ({
        diaryEntriesToShow: [...prevState.diaryEntriesToShow, this.props.entries[i]],
      }))
    }
    this.setState((prevState) => ({
      totalEntriesShowing: prevState.totalEntriesShowing + 15,
      moreToShow: (prevState.totalEntriesShowing + 15 < this.props.entries.length),
    }));
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
      <SafeAreaView style={this.props.lightTheme ? styles.notchContainer : styles.notchContainerDark}>
        <Appbar style={this.props.lightTheme ? styles.appBar : styles.appBarDark}>
          <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar>
        {this.state.showDiaryEntry ?
          <UpdateEntryScreen entry={this.props.entries[this.state.diaryEntryToShowIndex]}
            updateEntry={(entry) => this.updateEntry(entry, this.state.diaryEntryToShowIndex)}
            preferences={this.props.preferences} lightTheme={this.props.lightTheme}
          />
          :
          <View style={this.props.lightTheme ? {} : { backgroundColor: 'gray' }}>
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

            <ScrollView onScroll={({ nativeEvent }) => {
              if (this.isCloseToBottom(nativeEvent) && this.state.moreToShow) {
                this.loadMoreEntries();
              }
            }}
              style={this.props.lightTheme ? styles.timelineScroll : styles.timelineScrollDark}
            >
              <View style={this.props.lightTheme ? styles.mainContainer : styles.mainContainerDark}>
                {this.props.entries instanceof Array && this.props.entries.length > 0 ?
                  this.state.diaryEntriesToShow.map(this.eachDiaryEntryObject) :
                  <View style={this.props.lightTheme ? styles.centerContainer : styles.mainContainerDark}>
                    <Text style={this.props.lightTheme ? { marginTop: 10 } : {marginTop: 10, color: 'white'}}>No Diary Entries To Show</Text>
                  </View>
                }

                {this.state.moreToShow ? <ActivityIndicator size="large" color={Colors.blue} style={{marginTop: 5,}}/>
                  : <View></View>}
              </View>
            </ScrollView>
          </View>
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (store) => {
  const lightTheme = store.preferences.primaryTheme == "light";
  const entries = store.entries;
  const preferences = store.preferences;
  const accessToken = store.userInfo.userInfo.accessToken;
  const entriesId = store.userInfo.entriesId;
  return { entries, preferences, accessToken, entriesId, lightTheme };
}

export default connect(
  mapStateToProps,
  { updateEntries, updatePreferences }
)(TimelineSreen)