import cloneDeep from 'lodash/cloneDeep';
import {Command} from "./interfaces.action";
import * as G6 from '@antv/g6';
import {EventEditor} from "./cv";
import {getGraphState} from './toolkit';

class MgrCommand {
    command: {
        [propName: string]: Command;
    };
    commandQueue: Command[];
    commandIndex: number;

    constructor() {
        this.command = {};
        this.commandQueue = [];
        this.commandIndex = 0;
    }

    /* 命令注册 */
    registry(name: string, command: Command) {
        this.command[name] = {
            ...command,
            name,
        }
    }

    /* 执行命令 */
    execute(graph: G6.Graph, name: string, params?: object) {
        const Command = this.command[name];

        if (!Command) {
            return;
        }

        const command = Object.create(Command);

        command.params = cloneDeep(Command.params);

        if (params) {
            command.params = {
                ...command.params,
                ...params,
            };
        }

        if (!command.canExecute(graph)) {
            return;
        }

        if (!command.shouldExecute(graph)) {
            return;
        }

        command.init(graph);

        graph.emit(EventEditor.onBeforeExecuteCommand, {
            name: command.name,
            params: command.params,
        });

        command.execute(graph);

        graph.emit(EventEditor.onAfterExecuteCommand, {
            name: command.name,
            params: command.params,
        });

        if (command.canUndo(graph)) {
            const {commandQueue, commandIndex} = this;

            commandQueue.splice(commandIndex, commandQueue.length - commandIndex, command);

            this.commandIndex += 1;
        }

        graph.emit(EventEditor.onGraphStateChange, {
            graphState: getGraphState(graph),
        });
    }

    /* 判断是否可执行 */
    canExecute(graph: G6.Graph, name: string) {
        return this.command[name].canExecute(graph);
    }
}

export default new MgrCommand();