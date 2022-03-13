## Objects

<dl>
<dt><a href="#configuration">configuration</a> : <code>object</code></dt>
<dd><p>Builder configuration.</p>
</dd>
<dt><a href="#buildOptions">buildOptions</a> : <code>object</code></dt>
<dd><p>Build options.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#knownCtors">knownCtors</a></dt>
<dd><p>Known Ctors array
holds class definitions for determine should builder invoke provided function to extract result or not in case its a registered class definition</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#build">build(arg, invokeArgs, invokeContext)</a> ⇒</dt>
<dd><p>Builds an entity from provided buildOptions, if fiven value is a function it will be invoked with provided invokeArgs and invokeContext, see: <code>invokeValue</code></p>
</dd>
<dt><a href="#removeKnownCtor">removeKnownCtor(ctor, inherited)</a> ⇒</dt>
<dd><p>Removes provided class definition from <code>known ctors</code> array</p>
</dd>
<dt><a href="#addKnownCtor">addKnownCtor(arg)</a> ⇒</dt>
<dd><p>Adds provided class definition to <code>known ctors</code> array</p>
</dd>
<dt><a href="#isKnownCtor">isKnownCtor(arg)</a> ⇒</dt>
<dd><p>Checks if a given arguments is any of <code>known ctor</code></p>
</dd>
<dt><a href="#isKnownCtorInstance">isKnownCtorInstance(arg)</a> ⇒</dt>
<dd><p>Checks if a given argument is an instance of any <code>known ctor</code></p>
</dd>
<dt><a href="#invokeValue">invokeValue(value, invokeArgs, invokeContext)</a> ⇒</dt>
<dd><p>Invokes value and return invoked value if value is a function and not one of known ctors.</p>
</dd>
</dl>

<a name="configuration"></a>

## configuration : <code>object</code>
Builder configuration.

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| shouldThrow | <code>boolean</code> | defines the behavior of build() for wrong arguments. false: returns `undefined`, true: throws an Error |

<a name="buildOptions"></a>

## buildOptions : <code>object</code>
Build options.

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| class | <code>func</code> | required. Class to build |
| ctorArguments | <code>array</code> | optional. for multiple arguments constructor |

**Example** *(Single consructor argument)*  
```js
{
  class: MyClass,
  option1: 'foo',
  option2: 'bar'
}
=> new MyClass({ option1: 'foo', option: 'bar' })
```
**Example** *(Multiple constructor arguments)*  
```js
{
  class: MyClass,
  ctorArguments: ['abc','qwe']
  option1: 'foo',
  option2: 'bar'
}
=> new MyClass('abc', 'qwe')
note: in multi argument behavior any properties except `class` and `ctorArguments` will be ignnored
```
<a name="knownCtors"></a>

## knownCtors
Known Ctors arrayholds class definitions for determine should builder invoke provided function to extract result or not in case its a registered class definition

**Kind**: global constant  
**Example**  
```js
let test1 = String;let test2 = () => {};isKnownCtor(test1) // trueisKnownCtor(test2) // false//example invoke function:function invoke(arg, invokeArgs = [], invokeContext) {  if (typeof arg === 'function' && !isKnownCtor(arg)) {    arg = arg.apply(invokeContext, invokeArgs);  }  return arg;}
```
<a name="build"></a>

## build(arg, invokeArgs, invokeContext) ⇒
Builds an entity from provided buildOptions, if fiven value is a function it will be invoked with provided invokeArgs and invokeContext, see: `invokeValue`

**Kind**: global function  
**Returns**: entity instance or undefined  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>object</code> \| <code>func</code> | buildOptions obj (@see buildOptions.js) or function returned BuildOptions or Class definition |
| invokeArgs | <code>array</code> | optional, arguments for invoke function arg, see `invokeValue` |
| invokeContext | <code>obj</code> | optional, context for invoke function arg, see `invokeValue` |

<a name="removeKnownCtor"></a>

## removeKnownCtor(ctor, inherited) ⇒
Removes provided class definition from `known ctors` array

**Kind**: global function  
**Returns**: undefined if Class was not found, Class if Class was removed  

| Param | Type | Description |
| --- | --- | --- |
| ctor | <code>func</code> | Class to remove |
| inherited | <code>boolean</code> | false: will remove exactly provided class, true: will remove any one inherited or exactly provided |

**Example**  
```js
class MyClass {}// add class definition to known ctorsaddKnownCtor(MyClass);isKnwonCtor(MyClass); // true;// remove class definition from known ctorsremoveKnowCtor(MyClass);isKnwonCtor(MyClass); // false;
```
<a name="addKnownCtor"></a>

## addKnownCtor(arg) ⇒
Adds provided class definition to `known ctors` array

**Kind**: global function  
**Returns**: arg on success, undefined on fail  

| Param | Type |
| --- | --- |
| arg | <code>func</code> | 

<a name="isKnownCtor"></a>

## isKnownCtor(arg) ⇒
Checks if a given arguments is any of `known ctor`

**Kind**: global function  
**Returns**: true if given argument is known ctor otherwise false  

| Param | Type |
| --- | --- |
| arg | <code>any</code> | 

<a name="isKnownCtorInstance"></a>

## isKnownCtorInstance(arg) ⇒
Checks if a given argument is an instance of any `known ctor`

**Kind**: global function  
**Returns**: true if given argument is instance of known ctor otherwise false  

| Param | Type |
| --- | --- |
| arg | <code>any</code> | 

<a name="invokeValue"></a>

## invokeValue(value, invokeArgs, invokeContext) ⇒
Invokes value and return invoked value if value is a function and not one of known ctors.

**Kind**: global function  
**Returns**: value if its not a function or invoked value  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> |  |
| invokeArgs | <code>\*</code> | will be used as invoke argument / arguments |
| invokeContext | <code>\*</code> | will be used as invoke context |

**Example**  
```js
invokeValue(value); -> value.call();invokeValue(value, undefined, context); -> value.call(context);invokeValue(value, [], context); -> value.apply(context, []);invokeValue(value, null, context); -> value.call(context, null);invokeValue(value, [null], context); -> value.apply(context, [null]);invokeValue(value, someArg, context); -> value.call(context, someArg);invokeValue(value, someArg); -> value.call(undefined, someArg);
```
