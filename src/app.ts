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
        console.log(this.titleInputElement.value);
        const userInput = this.gatherUserInput();
        if( Array.isArray(userInput) ){
            const [title,description,manDay] = userInput;
            console.log(title,description,manDay);
        }

    }

    private configure(){
        this.element.addEventListener('submit',this.submitHandler);
        
    }

    private gatherUserInput():[string,string,number] | void {
        const enterdTitle = this.titleInputElement.value;
        const enterdDescription = this.descriptionInputElement.value;
        const enterdManday = this.mandayInputElement.value;
        if( enterdTitle.trim().length === 0 ||
        enterdDescription.trim().length === 0 ||
        enterdManday.trim().length === 0
        ){
            alert('入力値が正しくありません。再度お試しください。');
            return;
        } else {
            return [enterdTitle,enterdDescription,+enterdManday];
        }

    }
}





const prjInput = new PropjectInput();
