# entitybuilder
Its a small set of methods for building entities by build options and for determine if a given function is registered class definition or it is function which can be invoked.

## example
assume we have this:
```js
import { build, isKnownCtor } from 'yaff-entitybuilder';

class MyClass {
    constructor(options) {
        this.cid = 'the class sid';                
        this.options = { ...options };
    }
}

```

### figure 1:
```js
let test1 = build({ class: MyClass, propertyA: 'foo', propertyB: 'bar' });
console.log(test1);
```
output:
```
MyClass {
    options: {
        propertyA: 'foo',
        propertyB: 'bar'
    }
}
```


### figure 2:
```js
class MyOtherClass {
    constructor(models, options) {
        this.models = models;
        this.options = options;
    }
}
let test2 = build({ 
    class: MyClass, 
    ctorArguments: [
        [{id: 1}, {id: 2}],
        {
            propertyA: 'foo', propertyB: 'bar'
        }
    ]
});
console.log(test2);
```
output:
```
MyOtherClass {
    models: [
        { id: 1 },
        { id: 2 },
    ]
    options: {
        propertyA: 'foo',
        propertyB: 'bar'
    }
}
```

### figure 3:
```js
let result = isKnownCtor(MyClass); // false;
// and
let myclass = build(MyClass); // will throw, because MyClass is not yet registered.
```
by default know ctors does not include any of your class definition. you should add them manualy


now add this class to known ctors and try again:
```js
addKnownCtor(MyClass);

if (isKnownCtor(MyClass)) { // true;
    console.log(build(MyClass));
} 
```
output:
```
MyClass {
    options: {}
}
```


### figure 4:
You can wrap first argument 
```js
build(() => MyClass); // OK
build(() => ({ class: MyClass })); // OK
```

### figure 5:
the invoke method
```js
function invoke(arg, invokeArgs = [], invokeContext) {
  if (typeof arg === 'function' && !isKnownCtor(arg)) {
    arg = arg.apply(invokeContext, invokeArgs);
  }
  return arg;
}

class MyNextClass extends MyClass {

    getOption(key) {
        return invoke(this.options[key], [this], this);
    }

}


let test5 = build({ class: MyNextClass, option1: myClass => myClass.cid, option2: String  });
console.log(test5.getOption('option1')); // => "the class sid"
console.log(test5.getOption('option2')); // => String

```
output:
```
the class sid
String
```

For more details check reference.md