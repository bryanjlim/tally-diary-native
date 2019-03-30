import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  timelineScroll: {
    backgroundColor: 'white',
    height: '100%',
    paddingBottom: 300,
  },
  timelineScrollDark: {
    backgroundColor: Colors.backgroundDark,
    height: '100%',
  },
  filterButton: {
    width: 130,
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    backgroundColor: Colors.blue,
  },
  filterButtonDark: {
    width: 130,
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    backgroundColor: Colors.surfaceDark,
  }
})
