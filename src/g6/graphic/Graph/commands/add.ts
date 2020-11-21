import {BaseAttribute, BaseCommand, Cv, DataEdge, DataNode, MgrCommand, T} from '@/g6/ambient'

interface AddCommandParams {
    type: Cv.TypeItem;
    model: DataNode | DataEdge
}

const addCommand: BaseCommand<AddCommandParams> = {
    ...BaseAttribute,

    params: {
        type: Cv.TypeItem.Node,
        model: {
            id: '',
        }
    },

    init() {
        const {model} = this.params;

        if (model.id) {
            return;
        }

        model.id = T.guid();
    },

    execute(graph) {
        const {type, model} = this.params;

        graph.add(type, model);

        this.setSelectedItems(graph, [model.id]);
    },

    undo(graph) {
        const {model} = this.params;

        graph.remove(model.id);
    },
}

MgrCommand.registry("add", addCommand);