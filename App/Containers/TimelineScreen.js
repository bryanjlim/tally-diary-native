import React, { Component } from 'react'
import { SafeAreaView, ScrollView, View, ActivityIndicator } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { connect } from 'react-redux'
import { Appbar, Button, IconButton, Title } from 'react-native-paper';
import LargeEntryCard from '../Components/LargeEntryCard'
import SmallEntryCard from '../Components/SmallEntryCard'
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

    let diaryEntriesToShow = [];

    if (this.props.entries instanceof Array && this.props.entries.length > 0) {
      for (let i = 0; i < this.props.entries.length; i++) {
        diaryEntriesToShow[i] = this.props.entries[i];
      }
    }

    this.state = {
      showSmall: true,

      showConfirmationModal: false,
      diaryEntryToDelete: "None",
      showDiaryEntry: false,
      diaryEntryToShowIndex: "None",

      diaryEntriesToShow: diaryEntriesToShow,
      knownEntriesPropLength: this.props.entries.length,

      titleFilter: null,
      bodyFilter: null,
      dateFilterStart: null,
      dateFilterEnd: null,
      tallyFilter: null,
      goodDayFilter: null,
      badDayFilter: null,
      showFiltersModal: false,
      showHeadlines: false,
    }

    this.eachDiaryEntryObject = this.eachDiaryEntryObject.bind(this);
    this.assignIndexes = this.assignIndexes.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.updateEntry = this.updateEntry.bind(this);
    this.setFilters = this.setFilters.bind(this);
    this.updateFilteredList = this.updateFilteredList.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.isCloseToBottom = this.isCloseToBottom.bind(this);
    this.loadMoreEntries = this.loadMoreEntries.bind(this);
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y
      >= contentSize.height - 50;
  }

  loadMoreEntries() {
    this.setState({
      showSmall: false,
    })
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
    let filteredDiaryEntries = [];

    for (let i = 0; i < this.props.entries.length; i++) {
      let addEntry = true;
      const entry = this.props.entries[i];

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

      if (this.state.goodDayFilter) {
        if (!entry.isThumbsUp) {
          addEntry = false;
        }
      }

      if (this.state.badDayFilter) {
        if (!entry.isThumbsDown) {
          addEntry = false;
        }
      }

      if (addEntry) {
        filteredDiaryEntries.push(entry);
      }
    }

    this.setState({
      diaryEntriesToShow: filteredDiaryEntries,
    });
  }

  eachDiaryEntryObject = (entry, i) => {
    return (
      <View key={i} style={{ alignItems: 'center' }}>
        {this.state.showHeadlines ?
          <SmallEntryCard entry={entry} birthDate={this.props.preferences.dateOfBirth} lightTheme={this.props.lightTheme}
            delete={() => {
              this.setState({
                diaryEntryToDelete: entry.index,
                showConfirmationModal: true
              });
            }}
            view={() => {
              this.setState({
                showDiaryEntry: true,
                showSmall: true,
                diaryEntryToShowIndex: entry.index,
              })
            }} />
          :
          <LargeEntryCard entry={entry} birthDate={this.props.preferences.dateOfBirth} lightTheme={this.props.lightTheme}
            delete={() => {
              this.setState({
                diaryEntryToDelete: entry.index,
                showConfirmationModal: true
              });
            }}
            view={() => {
              this.setState({
                showDiaryEntry: true,
                showSmall: true,
                diaryEntryToShowIndex: entry.index,
              })
            }} />
        }

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
        showConfirmationModal: false,
      })
      this.forceUpdate();
      this.props.updateEntries(entriesArray);
    }
  }

  assignIndexes() {
    let entriesArray = [];
    if (this.props.entries instanceof Array && this.props.entries.length > 0) {
      for (let i = 0; i < this.props.entries.length; i++) {
        entriesArray[i] = this.props.entries[i];
        entriesArray[i].index = i;
      }
      this.props.updateEntries(entriesArray);
    }
  }

  render() {
    if (this.props.entries.length != this.state.knownEntriesPropLength) {
      this.assignIndexes();
      this.updateFilteredList();
      this.setState({
        knownEntriesPropLength: this.props.entries.length,
      });
    }

    let smallSelection = [];
    if (this.state.showSmall) {
      smallSelection = [...this.state.diaryEntriesToShow].splice(0, 5);
    }

    return (
      <SafeAreaView style={this.props.lightTheme ? styles.notchContainer : styles.notchContainerDark}>

        <Appbar style={this.props.lightTheme ? styles.appBar : styles.appBarDark}>
          <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
          <Title style={{fontSize: 20, color: 'white', marginLeft: 15,}}>Your Entries</Title>
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
              visible={this.state.showConfirmationModal}
              hideDialog={() => this.setState({ showConfirmationModal: false })}
              handleConfirm={() => { this.deleteEntry() }}
            />

            <ScrollView onScroll={({ nativeEvent }) => {
              if (this.isCloseToBottom(nativeEvent) && this.state.showSmall) {
                this.loadMoreEntries();
              }
            }}
              style={this.props.lightTheme ? styles.timelineScroll : styles.timelineScrollDark}
            >
              <View style={this.props.lightTheme ? styles.mainContainer : styles.mainContainerDark}>

                <View style={{ flexDirection: 'row' }}>
                  <Button
                    color={this.props.lightTheme ? 'white' : Colors.teal}
                    onPress={() => { this.setState({ showFiltersModal: true }) }}
                    style={this.props.lightTheme ? styles.filterButton : styles.filterButtonDark}
                  >
                    Filter
                        </Button>
                  <IconButton
                    style={{ marginTop: 20, marginLeft: 35, }}
                    icon="view-list"
                    color={this.props.lightTheme ? Colors.blue : Colors.teal}
                    disabled={!this.state.showHeadlines}
                    onPress={() => { this.setState({ showHeadlines: false, showSmall: true, }) }}
                  />
                  <IconButton
                    style={{ marginTop: 20, marginLeft: 20, }}
                    icon="view-headline"
                    color={this.props.lightTheme ? Colors.blue : Colors.teal}
                    disabled={this.state.showHeadlines}
                    onPress={() => { this.setState({ showHeadlines: true, showSmall: true, }) }}
                  />
                </View>

                {this.state.diaryEntriesToShow instanceof Array && this.state.diaryEntriesToShow.length > 0 ?
                  <View>
                    {this.state.showSmall ?
                      <View>
                        {smallSelection.map(this.eachDiaryEntryObject)}
                        {smallSelection.length < this.state.diaryEntriesToShow.length ?
                          <ActivityIndicator color={this.props.lightTheme ? Colors.blue : Colors.teal}
                            style={{ marginTop: 20, marginBottom: 30, }} /> :
                          <View></View>
                        }
                      </View>
                      :
                      this.state.diaryEntriesToShow.map(this.eachDiaryEntryObject)}
                  </View>
                  :
                  <View ></View>
                }

                <View style={{ padding: 100 }}></View>

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