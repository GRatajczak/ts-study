function Logger(logString: string) {
    return function (constructor: any) {
        console.log(logString);
    };
}

function WithTemplate(template: string, hookId: string) {
    return function (constructor: any) {
        const hookEl = document.getElementById("app");
        const p = new constructor();

        if (hookEl) {
            hookEl.innerHTML = `<h1>${template}</h1>`;

            hookEl.querySelector("h1")!.innerHTML = p.name;
        }
    };
}

function PropLogger(target: any, propertyName: string | Symbol) {
    console.log(target, propertyName);
}

function PropLogger2(target: any, propertyName: string | Symbol, descriptior: PropertyDecorator) {
    console.log(target, propertyName, descriptior);
}

function PropLogger3(target: any, propertyName: string | Symbol, descriptior: PropertyDecorator) {
    console.log(target, propertyName, descriptior);
}
function PropLogger4(target: any, name: string | Symbol, possition: number) {
    console.log(target, name, possition);
}

// @Logger("test")
// @WithTemplate("xx", "app")
// class Department {
//     @PropLogger
//     variableX: string;
//     private employees: string[] = [];
//     name = "test";
//     constructor() {
//         this.variableX = "test";
//         console.log("Constructo");
//     }
//     @PropLogger2
//     set price(val: string) {
//         console.log(val);
//     }
//     describe(this: Department) {
//         console.log("Department: " + this.name);
//     }
//     @PropLogger3
//     addEmployee(@PropLogger4 employee: string) {
//         this.employees.push(employee);
//     }
// }

function Autobind(_: any, _2: string | Symbol, propertyDescriptor: PropertyDescriptor) {
    const originalMethod = propertyDescriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFun = originalMethod.bind(this);
            return boundFun;
        },
    };
    return adjDescriptor;
}

// const test = new Department();

class Printer {
    message = "This is message";
    @Autobind
    showMessage() {
        console.log(this.message);
    }
}

const p = new Printer();

const button = document.querySelector("button");

button?.addEventListener("click", p.showMessage);

interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[];
    };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
    console.log(target.constructor);

    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ["required"],
    };
    console.log(registeredValidators[target.constructor.name]);
}
function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ["positive"],
    };
}
function validate(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig) {
        return true;
    }
    let isValid = true;
    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch (validator) {
                case "required":
                    isValid = isValid && !!obj[prop];
                    break;
                case "positive":
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }
    return isValid;
}

class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.price = p;
        this.title = t;
    }
}

const courseForm = document.querySelector("form")!;

courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector(".title") as HTMLInputElement;
    const price = document.querySelector(".price") as HTMLInputElement;

    const createdCourse = new Course(title.value, +price.value);

    if (!validate(createdCourse)) {
        alert("INVALID!");
        return;
    }
    console.log(createdCourse);
});
