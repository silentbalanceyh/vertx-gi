import React from 'react';
import {EditorContextProp, WrapEditorContext} from "./EditorContext";
import {Cv, MgrCommand,} from '@/g6/ambient';

interface CommandProp extends EditorContextProp {
    name: string;
    className?: string;
    classNameDisabled?: string;
}

interface CommandState {
}

class Command extends React.Component<CommandProp, CommandState> {
    static defaultProps = {
        className: 'command',
        classNameDisabled: 'command-disable',
    }

    state = {
        disabled: false
    }

    componentDidMount() {
        const {graph, name} = this.props;

        this.setState({
            disabled: !MgrCommand.canExecute(graph, name)
        });
        /*
         * 触发 onGraphStateChange 时更新 Command
         */
        graph.on(Cv.EventEditor.onGraphStateChange, () => {
            this.setState({
                disabled: !MgrCommand.canExecute(graph, name)
            });
        });
    }

    handleClick = () => {
        const {name, executeCommand} = this.props;

        executeCommand(name);
    }

    render() {
        const {graph} = this.props;
        if (graph) {
            const {className, classNameDisabled, children} = this.props;
            const {disabled = false} = this.state;
            return (
                <div className={`${className}${disabled ? ` ${classNameDisabled}` : ''}`}
                     onClick={this.handleClick}>
                    {children}
                </div>
            );
        } else return false;
    }
}

export default WrapEditorContext<CommandProp>(Command);