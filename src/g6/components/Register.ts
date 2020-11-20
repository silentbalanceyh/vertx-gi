import React from 'react';
import * as G6 from '@antv/g6';
import {Behavior, Command, MgrBehavior, MgrCommand} from '../ambient';

interface RegisterProp {
    name: string;
    config: object;
    extend?: string;
}

interface RegisterState {

}

class Registry extends React.Component<RegisterProp, RegisterState> {
    constructor(props: RegisterProp, type: string) {
        super(props);

        const {name, config, extend} = props;
        switch (type) {
            case 'node':
                G6.registerNode(name, config, extend);
                break;
            case 'edge':
                G6.registerEdge(name, config, extend);
                break;
            case 'command':
                MgrCommand.registry(name, config as Command);
                break;
            case 'behavior':
                MgrBehavior.registry(name, config as Behavior);
                break;
            default:
                break;
        }
    }

    static create = (type: string) => {
        return class extends Registry {
            constructor(props: RegisterProp) {
                super(props, type);
            }
        }
    }

    render() {
        return false;
    }
}

export const RegistryNode = Registry.create('node');
export const RegistryEdge = Registry.create('edge');
export const RegistryCommand = Registry.create('command');
export const RegistryBehavior = Registry.create('behavior');
