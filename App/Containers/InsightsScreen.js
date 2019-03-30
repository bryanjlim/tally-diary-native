import React, { Component } from 'react'
import { View, ScrollView, SafeAreaView } from 'react-native'
import { Appbar, Surface, Text, Title, List } from 'react-native-paper';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

// Styles
import styles from './Styles/InsightsScreenStyles'
import Colors from '../Themes/Colors'

class SettingsScreen extends Component {

    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon
                name="pie-chart"
                style={{ color: tintColor, marginLeft: -5, fontSize: 32 }}
            />
        ),
    };

    constructor(props) {
        super(props);

        this.state = {
            appLaunches: this.props.preferences.appLaunches,
        };

        this.eachTallyObject = this.eachTallyObject.bind(this);
    }

    eachTallyObject(tally) {
        return (
            <List.Item color={Colors.blue} title={tally.text + ": " + tally.count} />
        );
    }

    render() {

        let foodTallies = [];
        let peopleTallies = [];
        let activityTallies = [];
        let locationTallies = [];
        let otherTallies = [];

        // Populate tally lists using entry store
        for (let i = 0; i < this.props.entries.length; i++) {
            for (let j = 0; j < this.props.entries[i].tallies.length; j++) {
                let existsInTallies = false;
                const tallyMark = this.props.entries[i].tallies[j];
                const tallyMarkText = tallyMark.text;
                const tallyMarkType = tallyMark.type;
                const arrayToUse = tallyMarkType === "Food" ? foodTallies
                    : tallyMarkType === "Person" ? peopleTallies
                        : tallyMarkType === "Activity" ? activityTallies
                            : tallyMarkType === "Location" ? locationTallies
                                : otherTallies
                const arrayToUseLength = arrayToUse.length;
                for (let k = 0; k < arrayToUseLength; k++) {
                    if (!existsInTallies) {
                        if (arrayToUse[k].text === tallyMarkText) {
                            arrayToUse[k].count++;
                            existsInTallies = true;
                        }
                    }
                }
                if (!existsInTallies) {
                    arrayToUse.push({ text: tallyMarkText, count: 1 })
                }
            }
        }

        foodTallies.sort();
        peopleTallies.sort();
        activityTallies.sort();
        locationTallies.sort();
        otherTallies.sort();

        return (
            <SafeAreaView style={this.props.lightTheme ? styles.notchContainer : styles.notchContainerDark}>
                <Appbar style={this.props.lightTheme ? styles.appBar : styles.appBarDark}>
                    <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()} />
                </Appbar>
                <ScrollView style={this.props.lightTheme ? styles.mainContainer : styles.mainContainerDark}>
                    <View style={this.props.lightTheme ? styles.centerContainer : styles.centerContainerDark}>
                        <Surface style={this.props.lightTheme ? styles.appLaunchSurface : styles.appLaunchSurfaceDark}>
                            <Title style={this.props.lightTheme ? {} : { color: 'white' }}>Number of App Launches</Title>
                            <Text style={this.props.lightTheme ? {marginLeft: 10, } : 
                                { marginLeft: 10, color: 'white' }}>{this.state.appLaunches}</Text>
                        </Surface>
                        <Surface style={this.props.lightTheme ? styles.tallySurface : styles.tallySurfaceDark}>
                            <Title style={this.props.lightTheme ? { alignSelf: "center" } :
                                { alignSelf: "center", color: 'white' }}>Tallies</Title>
                            <List.Section>
                                <List.Accordion
                                    title="Food"
                                    theme={{ colors: this.props.lightTheme ? { primary: Colors.blue } : 
                                        { primary: Colors.teal, text: 'white' } }}
                                >
                                    {foodTallies.map(this.eachTallyObject)}
                                </List.Accordion>
                                <List.Accordion
                                    title="People"
                                    theme={{ colors: this.props.lightTheme ? { primary: Colors.blue } : 
                                        { primary: Colors.teal, text: 'white' } }}
                                >
                                    {peopleTallies.map(this.eachTallyObject)}
                                </List.Accordion>
                                <List.Accordion
                                    title="Activity"
                                    theme={{ colors: this.props.lightTheme ? { primary: Colors.blue } : 
                                        { primary: Colors.teal, text: 'white' } }}
                                >
                                    {activityTallies.map(this.eachTallyObject)}
                                </List.Accordion>
                                <List.Accordion
                                    title="Location"
                                    theme={{ colors: this.props.lightTheme ? { primary: Colors.blue } : 
                                        { primary: Colors.teal, text: 'white' } }}
                                >
                                    {locationTallies.map(this.eachTallyObject)}
                                </List.Accordion>
                                <List.Accordion
                                    title="Other"
                                    theme={{ colors: this.props.lightTheme ? { primary: Colors.blue } : 
                                        { primary: Colors.teal, text: 'white' } }}
                                >
                                    {otherTallies.map(this.eachTallyObject)}
                                </List.Accordion>
                            </List.Section>
                        </Surface>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        lightTheme: store.preferences.primaryTheme == "light",
        preferences: store.preferences,
        entries: store.entries,
    }
}

export default connect(
    mapStateToProps,
)(SettingsScreen)