import {Behavior, EventGraph} from "@/g6/ambient";

interface HoverAnchorBehavior extends Behavior {
    onEnterAnchor(e: EventGraph): void;

    onLeaveAnchor(e: EventGraph): void;
}