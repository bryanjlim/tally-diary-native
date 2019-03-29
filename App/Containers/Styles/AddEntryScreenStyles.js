import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    surface: {
        marginTop: 15,
        marginBottom: 100,
        width: '92%',
        padding: 8,
        paddingBottom: 10,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
    },
    dayLabel: {
        marginTop: 12,
        fontSize: 25,
        color: Colors.blue,
    },
    labelUnderline: {
        borderBottomColor: Colors.blue,
        paddingRight: 10,
        borderBottomWidth: .9,
    },
    inputTitle: {
        fontSize: 23,
        borderBottomColor: Colors.blue,
        borderBottomWidth: 1,
        width: '63%',
    },
    dateLabel: {
        marginTop: 10,
        fontSize: 15,
    },
    dateUnderline: {
        borderBottomColor: Colors.blue,
        borderBottomWidth: .9,
        width: 200,
        marginBottom: 10,
    },
    bodyText: {
        height: 300,
        borderColor: Colors.blue,
        backgroundColor: 'white',
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
        width: 150,
        height: 50,
        fontSize: 30,
        marginTop: 14,
    },
    addTallyButton: {
        marginLeft: 10,
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
    submitButton: {
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
    updateButton2: {
        alignSelf: 'center',
        width: 160,
        marginTop: 5,
        marginBottom: 21,
        paddingBottom: 3,
    }
})
