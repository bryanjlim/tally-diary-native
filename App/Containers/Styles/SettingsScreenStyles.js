import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  titleText: {
    fontSize: 15,
    paddingBottom: 8,
  },
  titleTextDark: {
    fontSize: 15,
    paddingBottom: 8,
    color: 'white',
  },
  topSurface: {
    padding: 8,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: 20,
    marginBottom: 10,
  },
  topSurfaceDark: {
    padding: 8,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: Colors.surfaceDark
  },
  surface: {
    padding: 8,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
  },
  surfaceDark: {
    padding: 8,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
    backgroundColor: Colors.surfaceDark,
  },
  signOutButton: 
  {
    marginBottom: 1,
  },
  signOutButtonDark: {
    marginBottom: 1,
    backgroundColor: Colors.backgroundDark,
  },
  dateSelector: {
    width: 250,
    backgroundColor: 'white',
    borderColor: Colors.blue,
  },
  dateSelectorDark: {
    width: 250,
    backgroundColor: Colors.surfaceDark,
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
  submitButtonDark: {
    marginTop: 15,
    paddingBottom: 1,
    marginBottom: 200,
    backgroundColor: Colors.surfaceDark,
  },
  appBar: {
    backgroundColor: Colors.blue,
  }
})
