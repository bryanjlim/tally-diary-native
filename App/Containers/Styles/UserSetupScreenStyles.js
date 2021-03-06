import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  horizontalCenter: {
    backgroundColor: Colors.transparent,
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeText: {
    paddingTop: 20,
    fontSize: 30,
    color: Colors.blue,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    color: Colors.blue,
  },
  surface: {
    borderRadius: 5,
    padding: 8,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 25,
  },
  dateSelector: {
    width: 250,
    backgroundColor: 'white',
    borderColor: Colors.blue,
  },
  radioGroup: {
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  leftRadio: {
    marginRight: 20,
    alignItems: 'center',
  },
  rightRadio: {
    alignItems: 'center',
  },
  none: {
    display: 'none',
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 15,
  }
})
