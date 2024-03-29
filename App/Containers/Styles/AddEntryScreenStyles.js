import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    surface: {
        borderRadius: 7,
        marginTop: 15,
        marginBottom: 120,
        width: '92%',
        padding: 8,
        paddingBottom: 10,
        elevation: 3,
    },
    surfaceDark: {
        borderRadius: 7,
        marginTop: 15,
        marginBottom: 120,
        backgroundColor: Colors.surfaceDark,
        width: '92%',
        padding: 8,
        paddingBottom: 10,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        alignSelf: 'stretch',
        alignContent: 'stretch',
    },
    titleWrapper: {
        flex: 1,
        alignContent: 'flex-start',
    },
    dateWrapper: {
        flex: 1,
        alignContent: 'flex-end',
        maxWidth: '45%',
        right: 0,
    },
    dayLabel: {
        fontSize: 30,
        marginTop: 12,
        marginLeft: 10,
    },
    dayLabelDark: {
        color: 'white',
        fontSize: 30,
        marginTop: 12,
        marginLeft: 10,
    },
    inputDate: {
        fontSize: 17,
        color: 'black',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
        marginTop: 12,
        right: 7,
    },
    inputDateDark: {
        fontSize: 17,
        color: 'white',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
        marginTop: 12,
        right: 7,
    },
    inputTitle: {
        marginLeft: 10,
        fontSize: 25,
        backgroundColor: 'white',
        color: 'black',
        width: '95%',
    },
    inputTitleDark: {
        marginLeft: 10,
        fontSize: 25,
        color: 'white',
        width: '95%',
        backgroundColor: Colors.surfaceDark,
    },
    topDivider: {
        marginTop: 7,
        width: '100%',
        backgroundColor: '#e8e8e8'
    },
    topDividerDark: {
        marginTop: 7,
        width: '100%',
        backgroundColor: '#5e5e5e'
    },
    divider: {
        width: '100%',
        backgroundColor: '#e8e8e8'
    },
    dividerDark: {
        width: '100%',
        backgroundColor: '#5e5e5e'
    },
    bodyText: {
        height: 300,
        borderColor: Colors.blue,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    bodyTextDark: {
        height: 300,
        borderColor: Colors.lightBlue,
        backgroundColor: Colors.surfaceDark,
        marginBottom: 10,
    },
    thumbButton: {
        marginBottom: 5,
        marginLeft: 15, 
    },
    tallyTitle: {
        marginLeft: 10,
        marginTop: 5,
    },
    tallyTitleDark: {
        marginLeft: 10,
        marginTop: 5,
        color: 'white',
    },
    tallyRow: {
        flexDirection: 'row',
        marginTop: -15,
    },
    dropdownMenu: {
        width: '28%',
        marginRight: 5,
        marginLeft: 10,
    },
    tallyTextInput: {
        backgroundColor: 'white',
        width: '52%',
        borderBottomColor: 'black',
        borderBottomWidth: .5,
        height: 40,
        marginTop: 23,
    },
    tallyTextInputDark: {
        backgroundColor: Colors.surfaceDark,
        width: '52%',
        color: 'white',
        borderBottomColor: 'white',
        borderBottomWidth: .5,
        height: 40,
        marginTop: 22,
    },
    addTallyButton: {
        marginLeft: 15,
        marginTop: 25,
    },
    tallyChipContainer: {
        maxWidth: '100%',
        alignSelf: 'baseline',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginBottom: 10,
    },
    tallyChip: {
        alignSelf: 'baseline',
        marginLeft: 10,
        marginTop: 7,
        maxWidth: '88%'
    },
    chipDark: {
        backgroundColor: 'gray',
    },
    submitButton: {
        alignSelf: 'center',
        width: 160,
        marginTop: 20,
        marginBottom: 20,
        paddingBottom: 2,
    },
    submitButtonDark: {
        backgroundColor: 'gray',
        color: 'white',
        alignSelf: 'center',
        width: 160,
        marginTop: 20,
        marginBottom: 20,
        paddingBottom: 2,
    },
    updateButton1: {
        alignSelf: 'center',
        width: 160,
        marginTop: 20,
        marginBottom: 7,
        paddingBottom: 3,
    },
    updateButton1Dark: {
        backgroundColor: 'gray',
        color: 'white',
        alignSelf: 'center',
        width: 160,
        marginTop: 20,
        marginBottom: 7,
        paddingBottom: 3,
    },
    updateButton2: {
        alignSelf: 'center',
        width: 160,
        marginTop: 5,
        marginBottom: 21,
        paddingBottom: 3,
    },
    updateButton2Dark: {
        backgroundColor: 'gray',
        color: 'white',
        alignSelf: 'center',
        width: 160,
        marginTop: 5,
        marginBottom: 21,
        paddingBottom: 3,
    }
})
