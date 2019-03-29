import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  timelineScroll: {
    backgroundColor: 'white',
    height: '100%',
    paddingBottom: 200,
  },
  timelineScrollDark: {
    backgroundColor: 'gray',
    height: '100%',
    paddingBottom: 200,
  }
})
