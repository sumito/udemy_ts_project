
// Drang & Drop
export interface  Draggable {
    dragStartHandler(event: DragEvent):void;
    dragEndHander(event: DragEvent):void;
}

export interface DragTarget{
    dragOverHander(event: DragEvent):void;
    dropHandler(event: DragEvent):void;
    dragLeaveHandler(event: DragEvent):void;
}

