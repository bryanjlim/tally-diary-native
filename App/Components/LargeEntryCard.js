import * as React from 'react';
import { Card, Paragraph, Button, } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import TimeHelper from '../Helpers/timeHelper'

import Colors from '../Themes/Colors'

export default class LargeEntryCard extends React.Component {
    render() {
        const entryDate = new Date(this.props.entry.date);
        const daysAlive = TimeHelper.calculateDayDifference(new Date(this.props.birthDate), entryDate);
        const readDate = TimeHelper.getReadableDate(entryDate);
        const textToShow = this.props.entry.bodyText;

        // Determine title to show (Ex: Day X vs. Day X - User Defined Title)
        const title = "Day " + daysAlive + (this.props.entry.title ? ' - ' + this.props.entry.title : '')

        return (
            <Card style={this.props.lightTheme ? { marginTop: 10, width: '95%' }
                : { marginTop: 10, width: '95%', backgroundColor: 'darkgray' }}>
                <Card.Title title={title} subtitle={readDate}
                    style={this.props.lightTheme ? {} : { color: 'white' }} />
                <Card.Content>
                    <Paragraph style={{ maxHeight: 50 }}>
                        {textToShow}
                    </Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={this.props.view} color={Colors.blue}
                        style={this.props.lightTheme ? {} : { backgroundColor: Colors.transparent }}
                    >
                        View
                    </Button>
                    <Button onPress={this.props.delete} color="red"
                        style={this.props.lightTheme ? {} : { backgroundColor: Colors.transparent }}
                    >
                        Delete
                    </Button>
                </Card.Actions>
            </Card>
        );
    }
}