import * as React from 'react';
import { Portal, Dialog, Button, Paragraph } from 'react-native-paper';
import Colors from '../Themes/Colors';

export default class ConfirmationModal extends React.Component {
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
                        Confirm Deletion
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph
                            style={this.props.lightTheme ? {} : { color: 'white' }}
                        >
                            This cannot be undone
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button color={this.props.lightTheme ? 'black' : 'white'} onPress={() => this.props.hideDialog()}>Cancel</Button>
                        <Button color={this.props.lightTheme ? Colors.blue : Colors.teal} onPress={() => this.props.handleConfirm()}>Confirm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}