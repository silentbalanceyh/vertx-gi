import {Behavior} from "./interfaces.action";
import * as G6 from '@antv/g6';
import {isMind} from './toolkit';
import {TypeGraph} from "./cv";
import {BehaviorOption} from "@antv/g6/lib/types";

class MgrBehavior {
    behaviors: {
        [propName: string]: Behavior;
    };

    constructor() {
        this.behaviors = {};
    }

    registered(type: TypeGraph) {
        const registered: any = {};

        Object.keys(this.behaviors).forEach(name => {
            const behavior = this.behaviors[name];

            const {graphType} = behavior;

            if (graphType && graphType !== type) {
                return;
            }

            const {graphMode = 'default'} = behavior;
            const keyMode = graphMode as string;

            if (!registered[keyMode]) {
                registered[keyMode] = {};
            }

            registered[keyMode][name] = name;
        });

        return registered;
    }

    wrapHandler(type: TypeGraph, behavior: Behavior): BehaviorOption {
        const events = behavior.getEvents();

        Object.keys(events).forEach(event => {
            const handlerName = events[event];
            const handler = behavior[handlerName] as Function;

            behavior[handlerName] = function (...params: any[]) {
                const {graph} = this;

                if (
                    (type === TypeGraph.Flow && isMind(graph as G6.Graph) === false) ||
                    (type === TypeGraph.Mind && isMind(graph as G6.Graph))
                ) {
                    handler.apply(this, params);
                }
            };
        });

        return behavior as BehaviorOption;
    }

    registry(name: string, behavior: Behavior) {
        const {graphType} = behavior;

        this.behaviors[name] = behavior;

        switch (graphType) {
            case TypeGraph.Flow:
                G6.registerBehavior(name, this.wrapHandler(TypeGraph.Flow, behavior));
                break;
            case TypeGraph.Mind:
                G6.registerBehavior(name, this.wrapHandler(TypeGraph.Mind, behavior));
                break;
            default:
                G6.registerBehavior(name, behavior as BehaviorOption);
                break;
        }
    }
}

export default new MgrBehavior();