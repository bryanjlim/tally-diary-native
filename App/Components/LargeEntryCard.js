import * as React from 'react';
import { Card, Paragraph, Button, View } from 'react-native-paper';
import { StyleSheet } from 'react-native';

import Colors from '../Themes/Colors'

export default class AppBar extends React.Component {
    render() {
        const entryDate = new Date(this.props.entry.date);
        entryDate.setDate(entryDate.getDate() + 1);
        const daysAlive = Math.round((entryDate - new Date(this.props.birthDate)) / (1000 * 60 * 60 * 24));
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
            "November", "December"];
        const weekDays = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."];
        const readDate = months[entryDate.getMonth()] + " " + (entryDate.getDate()) + ", " + entryDate.getFullYear() +
            " (" + weekDays[entryDate.getDay()] + ")";

        const textToShow = (this.props.entry.bodyText.length < 75) ? this.props.entry.bodyText :
            (this.props.entry.bodyText.substring(0, 76) + "...");


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