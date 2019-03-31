import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  appLaunchSurface: {
    marginTop: 20,
    padding: 8,
    width: '90%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
  },
  appLaunchSurfaceDark: {
    marginTop: 20,
    padding: 8,
    width: '90%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
    backgroundColor: Colors.surfaceDark,
  },
  entriesSurface: {
    padding: 8,
    width: '90%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
  },
  entriesSurfaceDark: {
    padding: 8,
    width: '90%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
    backgroundColor: Colors.surfaceDark,
  },
  tallySurface: {
    padding: 8,
    width: '90%',
    elevation: 2,
    marginBottom: 10,
  },
  tallySurfaceDark: {
    padding: 8,
    width: '90%',
    elevation: 2,
    marginBottom: 150,
    backgroundColor: Colors.surfaceDark
  }
})
