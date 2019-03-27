import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default class AppBar extends React.Component {
  render() {
    return (
      <Appbar style={styles.top}>
        <Appbar.Action icon="menu" onPress={() => console.log('Pressed archive')} />
      </Appbar>
    );
  }
}

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});