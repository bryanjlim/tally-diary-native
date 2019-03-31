import * as React from 'react';
import { Portal, Dialog, Button, TextInput, Switch, Title } from 'react-native-paper';
import { Keyboard, View } from 'react-native';
import TimeHelper from '../Helpers/timeHelper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Colors from '../Themes/Colors';

export default class TimelineFiltersModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            titleFilter: this.props.titleFilter,
            bodyFilter: this.props.bodyFilter,
            dateFilterStart: this.props.dateFilterStart,
            dateFilterEnd: this.props.dateFilterEnd,
            tallyFilter: this.props.tallyFilter,
            goodDayFilter: this.props.goodDayFilter,
            badDayFilter: this.props.badDayFilter,
            isDateTimePickerStartVisible: false,
            isDateTimePickerEndVisible: false,
        }

        this._handleDatePickedEnd = this._handleDatePickedEnd.bind(this);
        this._handleDatePickedStart = this._handleDatePickedStart.bind(this);

        this._hideDateTimePickerEnd = this._hideDateTimePickerEnd.bind(this);
        this._hideDateTimePickerStart = this._hideDateTimePickerStart.bind(this);

        this._showDateTimePickerEnd = this._showDateTimePickerEnd.bind(this);
        this._showDateTimePickerStart = this._showDateTimePickerStart.bind(this);

        this.cancel = this.cancel.bind(this);
    }

    _showDateTimePickerStart = () => this.setState({ isDateTimePickerStartVisible: true });

    _hideDateTimePickerStart = () => this.setState({ isDateTimePickerStartVisible: false });

    _handleDatePickedStart = (date) => {
        const readableDate = TimeHelper.getReadableDate(date);
        this.setState({
            dateFilterStart: readableDate
        });
        this._hideDateTimePickerStart();
    };

    _showDateTimePickerEnd = () => this.setState({ isDateTimePickerEndVisible: true });

    _hideDateTimePickerEnd = () => this.setState({ isDateTimePickerEndVisible: false });

    _handleDatePickedEnd = (date) => {
        const readableDate = TimeHelper.getReadableDate(date);
        this.setState({
            dateFilterEnd: readableDate
        });
        this._hideDateTimePickerEnd();
    };

    cancel() {
        this.setState({
            titleFilter: null,
            bodyFilter: null,
            dateFilterStart: null,
            dateFilterEnd: null,
            tallyFilter: null,
            goodDayFilter: false,
            badDayFilter: false,
            isDateTimePickerStartVisible: false,
            isDateTimePickerEndVisible: false,
        })
        this.props.hideDialog();
    }

    render() {
        return (
            <Portal>
                <Dialog
                    visible={this.props.visible}
                    onDismiss={this.props.hideDialog}
                    style={this.props.lightTheme ? {} : { backgroundColor: Colors.surfaceDark }}
                >
                    <Dialog.Title
                        style={this.props.lightTheme ? {} : { color: 'white' }}
                    >
                        Timeline Filters
                    </Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Contains Title"
                            style={{ marginBottom: 10, }}
                            theme={this.props.lightTheme ? { colors: { primary: Colors.blue } } :
                                { colors: { primary: Colors.teal, text: 'white', background: Colors.surfaceDark, placeholder: 'white' } }}
                            value={this.state.titleFilter}
                            onChangeText={(titleFilter) => this.setState({ titleFilter })}
                        />
                        <TextInput
                            label="Contains Body"
                            style={{ marginBottom: 10, }}
                            theme={this.props.lightTheme ? { colors: { primary: Colors.blue } } :
                                { colors: { primary: Colors.teal, text: 'white', background: Colors.surfaceDark, placeholder: 'white' } }}
                            value={this.state.bodyFilter}
                            onChangeText={(bodyFilter) => this.setState({ bodyFilter })}
                        />
                        <TextInput
                            label="Start Date"
                            style={{ marginBottom: 10, }}
                            theme={this.props.lightTheme ? { colors: { primary: Colors.blue } } :
                                { colors: { primary: Colors.teal, text: 'white', background: Colors.surfaceDark, placeholder: 'white' } }}
                            value={this.state.dateFilterStart}
                            editable={false}
                            onTouchStart={() => { Keyboard.dismiss(); this._showDateTimePickerStart(); }}
                        />
                        <TextInput
                            label="End Date"
                            style={{ marginBottom: 10, }}
                            theme={this.props.lightTheme ? { colors: { primary: Colors.blue } } :
                                { colors: { primary: Colors.teal, text: 'white', background: Colors.surfaceDark, placeholder: 'white' } }}
                            value={this.state.dateFilterEnd}
                            editable={false}
                            onTouchStart={() => { Keyboard.dismiss(); this._showDateTimePickerEnd(); }}
                        />
                        <TextInput
                            label="Contains Tally"
                            style={{ marginBottom: 10, }}
                            theme={this.props.lightTheme ? { colors: { primary: Colors.blue } } :
                                { colors: { primary: Colors.teal, text: 'white', background: Colors.surfaceDark, placeholder: 'white' } }}
                            value={this.state.tallyFilter}
                            onChangeText={(tallyFilter) => this.setState({ tallyFilter })}
                        />
                        <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20, }}>
                            <Title style={this.props.lightTheme ? {} : { color: 'white' }}>Limit To Good Days</Title>
                            <Switch
                                value={this.state.goodDayFilter}
                                style={{ position: 'absolute', right: 30, marginTop: 5, }}
                                theme={{ colors: { primary: Colors.blue } }}
                                onValueChange={() => { this.setState({ goodDayFilter: !this.state.goodDayFilter }); }
                                }
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20, }}>
                        <Title style={this.props.lightTheme ? {} : { color: 'white' }}>Limit To Bad Days</Title>
                        <Switch
                            value={this.state.badDayFilter}
                            style={{ position: 'absolute', right: 30, marginTop: 5, }}
                            theme={{ colors: { primary: Colors.blue } }}
                            onValueChange={() => { this.setState({ badDayFilter: !this.state.badDayFilter }); }
                            }
                        />
                        </View>
                    </Dialog.Content>
                <Dialog.Actions>
                    <Button color={this.props.lightTheme ? 'black' : 'white'} onPress={this.cancel}>Cancel</Button>
                    <Button
                        color={this.props.lightTheme ? Colors.blue : Colors.teal}
                        onPress={() => {
                            this.props.setFilters(this.state.titleFilter,
                                this.state.bodyFilter, this.state.dateFilterStart, this.state.dateFilterEnd,
                                this.state.tallyFilter, this.state.goodDayFilter, this.state.badDayFilter)
                        }}>
                        Set Filters
                        </Button>
                </Dialog.Actions>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerStartVisible}
                    onConfirm={this._handleDatePickedStart}
                    onCancel={this._hideDateTimePickerStart}
                />
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerEndVisible}
                    onConfirm={this._handleDatePickedEnd}
                    onCancel={this._hideDateTimePickerEnd}
                />
                </Dialog>
            </Portal >
        );
    }
}