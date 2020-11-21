import {Ambient, BaseAttribute, BaseCommand, DataNode, MgrCommand} from "@/g6/ambient";

const copyCommand: BaseCommand = {
    ...BaseAttribute,

    canExecute(graph) {
        return !!this.getSelectedNodes(graph).length;
    },

    canUndo() {
        return false;
    },

    execute(graph) {
        const nodes = this.getSelectedNodes(graph);

        Ambient.clipboard.models = nodes.map(node => node.getModel() as DataNode);
    },

    shortcuts: [
        ['metaKey', 'c'],
        ['ctrlKey', 'c'],
    ],
};

MgrCommand.registry("copy", copyCommand);