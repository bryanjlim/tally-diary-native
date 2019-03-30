import React, { Component } from 'react'
import { SafeAreaView, ScrollView, Text, View, ActivityIndicator } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { connect } from 'react-redux'
import { Appbar, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import LargeEntryCard from '../Components/LargeEntryCard'
import { updateEntries, updatePreferences } from '../Redux/actions'
import Icon from 'react-native-vector-icons/MaterialIcons'
import UpdateEntryScreen from './UpdateEntryScreen';
import TimelineFiltersModal from '../Components/TimelineFiltersModal';
import ConfirmationModal from '../Components/ConfirmationModal';

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


    let entriesCopy = [];
    for(let i = 0; i < this.props.entries.length; i++) {
      entriesCopy[i] = this.props.entries[i];
    }

    if (this.props.entries instanceof Array && this.props.entries.length > 0) {
      if (this.props.entries.length > 15) {
        moreToShow = true;
      }
      diaryEntriesToShow = entriesCopy.splice(0, 16)
    }

    this.state = {
      confirmationModalVisible: false,
      diaryEntryToDelete: "None",
      showDiaryEntry: false,
      diaryEntryToShowIndex: "None",
      totalEntriesShowing: 15,
      moreToShow: moreToShow,
      diaryEntriesToShow: diaryEntriesToShow,
      filteredDiaryEntries: [...this.props.entries],
      allEntries: [...this.props.entries],
      titleFilter: null,
      bodyFilter: null,
      dateFilterStart: null,
      dateFilterEnd: null,
      tallyFilter: null,
      goodDayFilter: null,
      badDayFilter: null,
      showFiltersModal: false,
    }

    this.eachDiaryEntryObject = this.eachDiaryEntryObject.bind(this);
    this.assignIndexes = this.assignIndexes.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.updateEntry = this.updateEntry.bind(this);
    this._showDialog = this._showDialog.bind(this);
    this._hideDialog = this._hideDialog.bind(this);
    this.isCloseToBottom = this.isCloseToBottom.bind(this);
    this.loadMoreEntries = this.loadMoreEntries.bind(this);
    this.setFilters = this.setFilters.bind(this);
    this.updateFilteredList = this.updateFilteredList.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  setFilters(titleFilter, bodyFilter, dateFilterStart, dateFilterEnd, tallyFilter, goodDayFilter, badDayFilter) {
      this.state.titleFilter = titleFilter,
      this.state.bodyFilter = bodyFilter,
      this.state.dateFilterStart = dateFilterStart,
      this.state.dateFilterEnd = dateFilterEnd,
      this.state.tallyFilter = tallyFilter,
      this.state.goodDayFilter = goodDayFilter,
      this.state.badDayFilter = badDayFilter,

    this.updateFilteredList();
    this.hideModal();
  }

  hideModal() {
    this.setState({
      showFiltersModal: false,
    });
  }

  updateFilteredList() {
    this.state.filteredDiaryEntries = [];

    for (let i = 0; i < this.state.allEntries.length; i++) {
      let addEntry = true;
      const entry = this.state.allEntries[i];

      if (this.state.dateFilterStart !== null && this.state.dateFilterEnd !== null) {
        if (new Date(entry.date) < new Date(this.state.dateFilterStart) || new Date(entry.date) > new Date(this.state.dateFilterEnd)) {
          addEntry = false;
        }
      } else if (this.state.dateFilterStart !== null && this.state.dateFilterEnd === null) {
        if (new Date(entry.date) < new Date(this.state.dateFilterStart)) {
          addEntry = false;
        }
      } else if (this.state.dateFilterStart === null && this.state.dateFilterEnd !== null) {
        if (new Date(entry.date) > new Date(this.state.dateFilterEnd)) {
          addEntry = false;
        }
      }

      if (entry.bodyText !== null && entry.bodyText !== undefined && this.state.bodyFilter !== null
        && this.state.bodyFilter !== undefined && this.state.bodyFilter !== '') {
        if (!entry.bodyText.includes(this.state.bodyFilter)) {
          addEntry = false;
        }
      }

      if (this.state.tallyFilter !== null && this.state.tallyFilter !== undefined && this.state.tallyFilter !== '') {
        let containsTally = false;
        for (let j = 0; j < entry.tallies.length; j++) {
          if (entry.tallies[j].text === this.state.tallyFilter) {
            containsTally = true;
          }
        }
        if (!containsTally) {
          addEntry = false;
        }
      }

      if(this.state.goodDayFilter) {
        if(!entry.isThumbsUp) {
          addEntry = false;
        }
      }

      if(this.state.badDayFilter) {
        if(!entry.isThumbsDown) {
          addEntry = false;
        }
      }

      if (addEntry) {
        this.state.filteredDiaryEntries.push(entry);
      }
    }

    let filteredEntriesCopy = [...this.state.filteredDiaryEntries];
    let moreToShow = filteredEntriesCopy.length > 15;
    let diaryEntriesToShow = filteredEntriesCopy.splice(0, 16);

    this.setState({
      diaryEntriesToShow,
      moreToShow,
    });
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
    if (this.state.filteredDiaryEntries < maxIndex) {
      maxIndex = this.state.filteredDiaryEntries.length;
    }

    for (let i = currentIndex; i < currentIndex + 15; i++) {
      this.setState((prevState) => ({
        diaryEntriesToShow: [...prevState.diaryEntriesToShow, this.state.filteredDiaryEntries[i]],
      }))
    }
    this.setState((prevState) => ({
      totalEntriesShowing: prevState.totalEntriesShowing + 15,
      moreToShow: (prevState.totalEntriesShowing + 15 < this.state.filteredDiaryEntries.length),
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
      allEntries: entriesArray,
    });
    this.updateFilteredList();
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

  _showDialog = () => this.setState({ confirmationModalVisible: true });

  _hideDialog = () => this.setState({ confirmationModalVisible: false });

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
          <View style={this.props.lightTheme ? {} : { backgroundColor: Colors.backgroundDark }}>

            <TimelineFiltersModal
              visible={this.state.showFiltersModal}
              hideDialog={this.hideModal}
              setFilters={this.setFilters}
              titleFilter={this.state.titleFilter}
              bodyFilter={this.state.bodyFilter}
              dateFilterStart={this.state.dateFilterStart}
              dateFilterEnd={this.state.dateFilterEnd}
              tallyFilter={this.state.tallyFilter}
              goodDayFilter={this.state.goodDayFilter}
              badDayFilter={this.state.badDayFilter}
            />

            <ConfirmationModal 
            visible={this.state.confirmationModalVisible} 
            hideDialog={this._hideDialog}
            handleConfirm={() => {this.deleteEntry()}}
            />

            <ScrollView onScroll={({ nativeEvent }) => {
              if (this.isCloseToBottom(nativeEvent) && this.state.moreToShow) {
                this.loadMoreEntries();
              }
            }}
              style={this.props.lightTheme ? styles.timelineScroll : styles.timelineScrollDark}
            >
              <View style={this.props.lightTheme ? styles.mainContainer : styles.mainContainerDark}>

                {this.props.entries instanceof Array && this.props.entries.length > 0 ?

                  <View>
                    <Button
                      color={this.props.lightTheme ? 'white' : Colors.teal}
                      onPress={() => { this.setState({ showFiltersModal: true }) }}
                      style={this.props.lightTheme ? styles.filterButton : styles.filterButtonDark}
                    >
                      Filter
                    </Button>

                    {this.state.diaryEntriesToShow.map(this.eachDiaryEntryObject)}
                  </View>
                  :

                  <View style={this.props.lightTheme ? styles.centerContainer : styles.centerContainerDark}>
                    <Text style={this.props.lightTheme ? { marginTop: 10 } : { marginTop: 10, color: 'white' }}>No Diary Entries To Show</Text>
                  </View>
                }

                {this.state.moreToShow ?
                  <ActivityIndicator size="large" color={Colors.blue} style={{ marginTop: 5, }} /> :
                  <View></View>}

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