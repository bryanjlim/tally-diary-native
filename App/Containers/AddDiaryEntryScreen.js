import React, { Component } from 'react'
import { SafeAreaView, ScrollView, Text, Image, View } from 'react-native'
import DriveHelper from '../Helpers/newDriveHelper'
import { connect } from 'react-redux'
import { Appbar, Button } from 'react-native-paper';
import { updateEntries } from '../Redux/actions'
import Icon from 'react-native-vector-icons/MaterialIcons'

// Styles
import styles from './Styles/TimelineScreenStyles'

class AddDiaryEntryScreen extends Component {

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon
        name="add"
        style={{ color: tintColor, fontSize: 32 }}
      />
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      title: "",
      date: "",
      bodyText: "",
      tallies: [],
      todos: [],
      isThumbsUp: false,
      isThumbsDown: false,
      entryNumber: entries.length + 1,
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.notchContainer}>
        <Appbar style={styles.appBar}>
          <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar>
        <ScrollView>
          <View style={styles.mainContainer}>

          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (store) => {
  const entries = store.entries.entries;
  return { entries };
}

export default connect(
  mapStateToProps,
  { updateEntries }
)(AddDiaryEntryScreen)