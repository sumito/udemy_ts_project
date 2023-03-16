

import {Component} from './base-component.js';
import {Draggable} from '../models/drag-drop.js';
import {Project} from '../models/project.js';
import {autobind} from '../decorators/autobind.js';

export class ProjectItem extends Component<HTMLUListElement,HTMLLIElement> 
implements Draggable{
    private project: Project;

    constructor(hostId: string, project: Project){
        super("single-project",hostId,false,project.id);
        this.project = project;
        this.configure();
        this.renderContent();

    }

    get manday(){
        if( this.project.monday < 20 ){
            return this.project.monday.toString() + '人日';
        } else {
            return (this.project.monday/20).toString() + '人月';           
        }
    }

    renderContent(): void {

        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.manday;
        this.element.querySelector('p')!.textContent = this.project.description;

    }

    @autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain',this.project.id);
        event.dataTransfer!.effectAllowed = 'move';

    }

    @autobind
    dragEndHander(_: DragEvent): void {

    }


    configure(): void {
        this.element.addEventListener('dragstart',this.dragStartHandler);
        this.element.addEventListener('dragend',this.dragEndHander);
    }

}    
