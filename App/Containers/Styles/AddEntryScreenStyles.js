import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    surface: {
        marginTop: 15,
        marginBottom: 120,
        width: '92%',
        padding: 8,
        paddingBottom: 10,
        elevation: 3,
    },
    surfaceDark: {
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
    inputTitle: {
        fontSize: 23,
        height: 50,
        backgroundColor: 'white',
    },
    inputTitleDark: {
        color: 'white',
        fontSize: 23,
        height: 50,
        backgroundColor: Colors.surfaceDark,
    },
    topDivider: {
        marginTop: 15,
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
        width: 100,
        marginRight: 5,
        marginLeft: 10,
    },
    tallyTextInput: {
        backgroundColor: 'white',
        width: 200,
        borderBottomColor: 'black',
        borderBottomWidth: .5,
        height: 40,
        marginTop: 22,
    },
    tallyTextInputDark: {
        backgroundColor: Colors.surfaceDark,
        width: 200,
        borderBottomColor: 'white',
        borderBottomWidth: .5,
        height: 40,
        marginTop: 22,
    },
    addTallyButton: {
        marginLeft: 20,
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
