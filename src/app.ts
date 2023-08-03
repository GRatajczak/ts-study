interface Validatable {
    value: string | number;
    required: boolean;
    minLenght?: number;
    maxLenght?: number;
    min?: number;
    max?: number;
}

function validateFun(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (
        validatableInput.minLenght &&
        typeof validatableInput.value === "string" &&
        validatableInput.minLenght != null
    ) {
        isValid = isValid && validatableInput.value.length > validatableInput.minLenght;
    }
    if (
        validatableInput.maxLenght &&
        typeof validatableInput.value === "string" &&
        validatableInput.minLenght != null
    ) {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLenght;
    }
    if (validatableInput.min != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value > validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value < validatableInput.max;
    }
    return isValid;
}

function AutobindDecorator(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}

class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor(private type: "active" | "finished") {
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${type}-projects`;
        this.attach();
        this.renderContent();
    }

    private attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }

    private renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
    }
}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    descriptionElement: HTMLInputElement;
    peopleElement: HTMLInputElement;
    titleElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = "user-input";

        this.descriptionElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleElement = this.element.querySelector("#people") as HTMLInputElement;
        this.titleElement = this.element.querySelector("#title") as HTMLInputElement;

        this.configure();
        this.attach();
    }
    @AutobindDecorator
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
        }
        console.log(this.titleElement.value);
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleElement.value;
        const enteredDescription = this.descriptionElement.value;
        const enteredPeople = this.peopleElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLenght: 5,
        };
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (
            !validateFun(titleValidatable) ||
            !validateFun(descriptionValidatable) ||
            !validateFun(peopleValidatable)
        ) {
            alert("Plese try again!");
            return;
        } else {
            this.clearInputs();
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleElement.value = "";
        this.descriptionElement.value = "";
        this.peopleElement.value = "";
    }

    private configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}

const projInpt = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
