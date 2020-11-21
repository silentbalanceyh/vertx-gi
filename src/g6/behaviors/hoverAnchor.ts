import {Behavior, Cv, EventGraph} from "@/g6/ambient";

interface HoverAnchorBehavior extends Behavior {
    onEnterAnchor(e: EventGraph): void;

    onLeaveAnchor(e: EventGraph): void;
}

const hoverAnchor: HoverAnchorBehavior = {
    graphType: Cv.TypeGraph.Flow,

}