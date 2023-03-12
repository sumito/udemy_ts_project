
//project type
enum ProjectStatus {
    Active
    ,Finished
}

//project type
class Project{

    constructor( 
        public id: string,
        ,public title: string
        , public descriptions: string
        , public monday: number
        , public status: ProjectStatus.Active | ProjectStatus.Finished  )
        {

    }

}

//project state management
type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Project[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;


    private constructor(){

    }

    static getInstance(){
        if( this.instance ){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener ){
        this.listeners.push(listenerFn);
    }


    addProject( title:string , description:string , manday:number ){
        const newProject = new Project(Math.random().toString(),title,description,manday,ProjectStatus.Active);

        this.projects.push(newProject);

        for( const listenerFn of this.listeners ){
            listenerFn(this.projects.slice());
        }

    }

}

const projectState = ProjectState.getInstance();




//auto bind decorator
function autobind( _: any, _2:string,descriptor:PropertyDescriptor ){
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}


interface Validatable{
    value: string | number;
    required?: Boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate( validatableInput: Validatable ){
    let isValid = true;
    if( validatableInput.required ){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if( validatableInput.minLength != null && 
        typeof validatableInput.value === 'string' ){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if( validatableInput.maxLength != null && 
        typeof validatableInput.value === 'string' ){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if( validatableInput.min != null && 
        typeof validatableInput.value === 'number' ){
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if( validatableInput.max != null && 
        typeof validatableInput.value === 'number' ){
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }

    return isValid;
}



//ProjectList Class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[] = [];

    constructor( private type : ProjectStatus.Active | ProjectStatus.Finished ){
        this.templateElement = document.getElementById(
        'project-list',
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content,true);

        this.element = importedNode.firstElementChild as HTMLFormElement;]
        const typeId = type === ProjectStatus.Active ? "" : "finished";
        this.element.id = `${typeId}-projects`;

        projectState.addListener( (projects: Project[]) => {
            const relevantProjects = projects.filter( prj => {
                if(this.type === ProjectStatus.Active){
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;

            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });

        this.attach();
        this.renderContent();
    }

    private renderProjects(){

        const listEl = document.getElementById(
            `${this.type}-projects-list`
        )! as HTMLUListElement;
        listEl.innerHTML = '';
        for ( const prjItem of this.assignedProjects ){
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            console.log(listEl);
            listEl.appendChild(listItem);
        }

    }

    private renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type === ProjectStatus.Active ? '実行中プロジェクト' : '完了プロジェクト';
    }

    private attach(){
        console.log(this.element);        
        this.hostElement.insertAdjacentElement('beforeend',this.element);
    }
}


//ProjectInput
class PropjectInput{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    titleInputElement : HTMLInputElement;
    descriptionInputElement : HTMLInputElement;
    mandayInputElement : HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description',) as HTMLInputElement;
        this.mandayInputElement = this.element.querySelector('#manday') as HTMLInputElement;

        this.configure();

        this.attach();
    }

    private attach(  ){
        console.log(this.element);        
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }

    @autobind
    private submitHandler( event: Event ){
        event.preventDefault();

        const userInput = this.gatherUserInput();
        
        if( Array.isArray(userInput) ){
            const [title,description,manDay] = userInput;

            //console.log(title,description,manDay);

            projectState.addProject(title,description,manDay);
            this.clearInput();
        }

    }

    private configure(){
        this.element.addEventListener('submit',this.submitHandler);
        
    }


    private gatherUserInput():[string,string,number] | void {


        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredManday = this.mandayInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        };

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength:5
        };
        const mandayValidatable: Validatable = {
            value: enteredManday,
            required: true,
            min: 1,
            max: 1000
        };

        if(
        !validate( titleValidatable ) ||
        !validate( descriptionValidatable ) ||
        !validate( mandayValidatable ) 
        ){
            alert('入力値が正しくありません。再度お試しください。');
            return;
        } else {
            return [enteredTitle,enteredDescription,+enteredManday];
        }

    }

    private clearInput(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.mandayInputElement.value = '';
        
    }
}





const prjInput = new PropjectInput();
const activePrjList = new ProjectList(ProjectStatus.Active);
const finishedPrjList = new ProjectList(ProjectStatus.Finished);

