import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, ActivityIndicator } from 'react-native';
import DriveHelper from '../Helpers/driveHelper';
import { connect } from 'react-redux';
import { Appbar, Button, IconButton, Title } from 'react-native-paper';
import LargeEntryCard from '../Components/LargeEntryCard';
import SmallEntryCard from '../Components/SmallEntryCard';
import { updateEntries, updatePreferences } from '../Redux/actions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UpdateEntryScreen from './UpdateEntryScreen';
import TimelineFiltersModal from '../Components/TimelineFiltersModal';
import ConfirmationModal from '../Components/ConfirmationModal';
import firebase from 'react-native-firebase';

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

    let numberToShow = 5;
    if (this.props.entries.length < 5) {
      numberToShow = this.props.entries.length;
    }

    this.state = {
      numberToShow: numberToShow,

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

  componentDidMount() {
    firebase.analytics().setCurrentScreen("Timeline");
  }

  isCloseToBottom() {
    // Hack
    return true;
  }

  loadMoreEntries() {
    let newNumberToShow = this.state.numberToShow + 5;
    if (newNumberToShow > this.state.diaryEntriesToShow.length) {
      newNumberToShow = this.state.diaryEntriesToShow.length;
    }

    this.setState({
      numberToShow: newNumberToShow,
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

  updateFilteredList(array) {
    let filteredDiaryEntries = [];

    let arrayToUse = array ? array : this.props.entries;

    for (let i = 0; i < arrayToUse.length; i++) {
      let addEntry = true;
      const entry = arrayToUse[i];

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

      if (entry.title !== null && entry.title !== undefined && this.state.titleFilter !== null
        && this.state.titleFilter !== undefined && this.state.titleFilter !== '' && addEntry) {
        if (!entry.title.includes(this.state.titleFilter)) {
          addEntry = false;
        }
      }

      if (entry.bodyText !== null && entry.bodyText !== undefined && this.state.bodyFilter !== null
        && this.state.bodyFilter !== undefined && this.state.bodyFilter !== '' && addEntry) {
        if (!entry.bodyText.includes(this.state.bodyFilter)) {
          addEntry = false;
        }
      }

      if (this.state.tallyFilter !== null && this.state.tallyFilter !== undefined && this.state.tallyFilter !== ''
        && addEntry) {
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

      if (this.state.goodDayFilter && addEntry) {
        if (!entry.isThumbUp) {
          addEntry = false;
        }
      }

      if (this.state.badDayFilter && addEntry) {
        if (!entry.isThumbDown) {
          addEntry = false;
        }
      }

      if (addEntry) {
        filteredDiaryEntries.push(entry);
      }
    }

    let baseNumberToShow = 5;
    if (filteredDiaryEntries.length < 5) {
      baseNumberToShow = filteredDiaryEntries.length;
    }

    this.setState({
      diaryEntriesToShow: filteredDiaryEntries,
      numberToShow: baseNumberToShow,
    });

    this.assignIndexes();
  }

  eachDiaryEntryObject = (entry, i) => {
    let baseNumberToShow = 5;
    if (this.state.diaryEntriesToShow.length < 5) {
      baseNumberToShow = this.props.entries.length;
    }

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
                numberToShow: baseNumberToShow,
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
                numberToShow: baseNumberToShow,
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

    entriesArray.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })

    DriveHelper.patchFile(this.props.accessToken, entriesArray, "1", this.props.entriesId);
    this.setState({
      showDiaryEntry: false,
    });
    entriesArray = this.assignIndexes(entriesArray);
    this.updateFilteredList(entriesArray);
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

      entriesArray = this.assignIndexes(entriesArray);
      this.updateFilteredList(entriesArray);
      this.props.updateEntries(entriesArray);
    }
  }

  assignIndexes(array) {
    let entriesArray = [];

    const arrayToIndex = array ? array : this.props.entries;

    if (arrayToIndex instanceof Array && arrayToIndex.length > 0) {
      for (let i = 0; i < arrayToIndex.length; i++) {
        entriesArray[i] = arrayToIndex[i];
        entriesArray[i].index = i;
      }
      this.props.updateEntries(entriesArray);
    }
    return entriesArray;
  }

  render() {
    if (this.props.entries.length != this.state.knownEntriesPropLength) {
      this.assignIndexes();
      this.updateFilteredList();
      this.setState({
        knownEntriesPropLength: this.props.entries.length,
      });
    }

    let baseNumberToShow = 5;
    if (this.state.diaryEntriesToShow.length < 5) {
      baseNumberToShow = this.props.entries.length;
    }

    let viewableSelection = [];
    if (this.state.numberToShow <= this.state.diaryEntriesToShow.length) {
      viewableSelection = [...this.state.diaryEntriesToShow].splice(0, this.state.numberToShow);
    }

    return (
      <SafeAreaView style={this.props.lightTheme ? styles.notchContainer : styles.notchContainerDark}>

        <Appbar style={this.props.lightTheme ? styles.appBar : styles.appBarDark}>
          <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
          <Title style={{ fontSize: 20, color: 'white', marginLeft: 15, }}>Your Entries</Title>
        </Appbar>

        {this.state.showDiaryEntry ?
          <UpdateEntryScreen entry={this.props.entries[this.state.diaryEntryToShowIndex]}
            updateEntry={(entry) => this.updateEntry(entry, this.state.diaryEntryToShowIndex)}
            preferences={this.props.preferences} lightTheme={this.props.lightTheme}
          />
          :
          <View style={this.props.lightTheme ? {} : { backgroundColor: Colors.backgroundDark }}>

            <TimelineFiltersModal
              lightTheme={this.props.lightTheme}
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
              lightTheme={this.props.lightTheme}
              visible={this.state.showConfirmationModal}
              hideDialog={() => this.setState({ showConfirmationModal: false })}
              handleConfirm={() => { this.deleteEntry() }}
            />

            <ScrollView onScroll={({ nativeEvent }) => {
              if (this.isCloseToBottom(nativeEvent) && this.state.numberToShow <= this.state.diaryEntriesToShow.length) {
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
                    onPress={() => { this.setState({ showHeadlines: false, numberToShow: baseNumberToShow, }) }}
                  />
                  <IconButton
                    style={{ marginTop: 20, marginLeft: 20, }}
                    icon="view-headline"
                    color={this.props.lightTheme ? Colors.blue : Colors.teal}
                    disabled={this.state.showHeadlines}
                    onPress={() => { this.setState({ showHeadlines: true, numberToShow: baseNumberToShow, }) }}
                  />
                </View>

                {this.state.diaryEntriesToShow instanceof Array && this.state.diaryEntriesToShow.length > 0 ?
                  <View>
                    <View>
                      {viewableSelection.map(this.eachDiaryEntryObject)}
                      {viewableSelection.length < this.state.diaryEntriesToShow.length ?
                        <ActivityIndicator color={this.props.lightTheme ? Colors.blue : Colors.teal}
                          style={{ marginTop: 20, marginBottom: 30, }} /> :
                        <View></View>
                      }
                    </View>
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