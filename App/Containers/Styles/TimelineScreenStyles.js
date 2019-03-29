import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  timelineScroll: {
    backgroundColor: 'white',
    marginBottom: 75,
    paddingBottom: 200,
  }
})
