import * as React from 'react';
import { Card, Paragraph, Button, View } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import TimeHelper from '../Helpers/timeHelper'

import Colors from '../Themes/Colors'

export default class AppBar extends React.Component {
    render() {
        const entryDate = new Date(this.props.entry.date);
        const daysAlive = TimeHelper.calculateDayDifference(new Date(this.props.birthDate), entryDate);
        const readDate = TimeHelper.getReadableDate(entryDate);
        const textToShow = this.props.entry.bodyText;
        
        // Determine title to show (Ex: Day X vs. Day X - User Defined Title)
        const title = "Day " + daysAlive + (this.props.entry.title ? ' - ' + this.props.entry.title : '')

        return (
            <Card style={{ marginTop: 10, width: '95%' }}>
                <Card.Title title={title} subtitle={readDate} />
                <Card.Content>
                    <Paragraph style={{ maxHeight: 50 }}>{textToShow}</Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button color={Colors.blue}>View</Button>
                </Card.Actions>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    top: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
});