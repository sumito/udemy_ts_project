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
