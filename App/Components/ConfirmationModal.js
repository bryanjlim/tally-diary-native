import * as React from 'react';
import { Portal, Dialog, Button, Paragraph } from 'react-native-paper';
import Colors from '../Themes/Colors';

export default class ConfirmationModal extends React.Component {
    render() {
        return (
            <Portal>
                <Dialog
                    visible={this.props.visible}
                    onDismiss={this.props.hideDialog}>
                    <Dialog.Title>Confirm Deletion</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>This cannot be undone</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button color={Colors.blue} onPress={() => this.props.handleConfirm()}>Confirm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}