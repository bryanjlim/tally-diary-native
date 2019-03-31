import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  appLaunchSurface: {
    borderRadius: 5,
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
    borderRadius: 5,
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
    borderRadius: 5,
    padding: 8,
    width: '90%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
  },
  entriesSurfaceDark: {
    borderRadius: 5,
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
    borderRadius: 5,
    padding: 8,
    width: '90%',
    elevation: 2,
    marginBottom: 10,
  },
  tallySurfaceDark: {
    borderRadius: 5,
    padding: 8,
    width: '90%',
    elevation: 2,
    marginBottom: 150,
    backgroundColor: Colors.surfaceDark
  }
})
