import React, { Component } from 'react'
import { SafeAreaView, ScrollView, Text, Image, View } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { connect } from 'react-redux'
import { Appbar } from 'react-native-paper';
import LargeEntryCard from '../Components/LargeEntryCard'
import { updateEntries, updatePreferences } from '../Redux/actions'

// Styles
import styles from './Styles/TimelineScreenStyles'

class TimelineSreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      diaryEntriesToShow: this.props.entries,
    };

    this.eachDiaryEntryObject = this.eachDiaryEntryObject.bind(this);
  }

  eachDiaryEntryObject(entry) {
    return (
      <View style={{ alignItems: 'center' }}>
        <LargeEntryCard entry={entry} birthDate={this.props.preferences.dateOfBirth} />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.notchContainer}>
        <Appbar style={styles.appBar}>
          <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar>
        <ScrollView>
          <View style={styles.mainContainer}>
            {this.state.diaryEntriesToShow instanceof Array && this.state.diaryEntriesToShow.length > 0 ?
              this.state.diaryEntriesToShow.map(this.eachDiaryEntryObject) :
              <View style={styles.centerContainer}>
                <Text style={{marginTop: 10}}>No Diary Entries To Show</Text>
              </View>
            }

          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (store) => {
  const entries = store.entries.entries;
  const preferences = store.preferences.preferences;
  return { entries, preferences };
}

export default connect(
  mapStateToProps,
  { updateEntries, updatePreferences }
)(TimelineSreen)