import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainer: {
    backgroundColor: Colors.background,
    paddingTop: 15,
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
    paddingBottom: 12,
  },
  surface: {
    padding: 8,
    width: '90%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
  },
  signOutButton: 
  {
    marginBottom: 1,
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
    marginTop: 15,
    paddingBottom: 1,
    marginBottom: 200,
  },
  appBar: {
    backgroundColor: Colors.blue,
  }
})
