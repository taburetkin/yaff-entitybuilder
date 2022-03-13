import { expect } from "chai";
import { cloneObject, ensureBuildOptions, normalizeBuildOptions } from "../../utils";

describe('utils', function() {

    describe('cloneObject', function() {
        it('should return undefined without arguments', function() {
            let val = cloneObject();
            expect(val).to.be.undefined;
        });

        it('should return passed arg if its not an object', function() {
            let val = cloneObject('foo');
            expect(val).to.be.equal('foo');
        });

        it('should return another instance of object with same properties', function() {
            let test = { foo: 'bar', index: 1 };
            let cloned = cloneObject(test);
            expect(cloned).to.be.not.equal(test);
            expect(cloned).has.property('foo').equal('bar');
            expect(cloned).has.property('index').equal(1);
        });

        it('should return another instance of object with same properties excepts excluded', function() {
            let test = { foo: 'bar', index: 1, prop1: 'foo', prop2: 2 };
            let cloned = cloneObject(test, 'prop1', 'prop2');
            expect(cloned).to.be.not.equal(test);
            expect(cloned).has.property('foo').equal('bar');
            expect(cloned).has.property('index').equal(1);
            expect(cloned).has.not.property('prop1');
            expect(cloned).has.not.property('prop2');
        });

    });

    describe('ensureBuildOptions', function() {

        it('should return false if given arg is not an object', function() {
            let val = ensureBuildOptions('asd');
            expect(val).to.be.equal(false);
        });

        it('should throw if given arg is not an object and secondArgument is true', function() {
            expect(ensureBuildOptions.bind(null, 'asd', true)).to.throw();
        });

        it('should return false if given arg has no function in class property', function() {
            let val = ensureBuildOptions({ class: 'foo' });
            expect(val).to.be.equal(false);
        });

        it('should throw if given arg has no class property and secondArgument is true', function() {
            expect(ensureBuildOptions.bind(null, { class: 'foo' }, true)).to.throw();
        });


        it('should return true if given argument is an object and has function in a class property', function() {
            let val = ensureBuildOptions({ class: () => {} });
            expect(val).to.be.equal(true);
        });
    });

    describe('normalizeBuildOptions', function() {

        function isPositiveReturn(value, funcWrap)
        {
            let { classType, options, valueToNormalize } = prepareArgs(value, funcWrap);
            let normalized = normalizeBuildOptions(valueToNormalize);
            makeExpectations(normalized, classType, options);
        }

        function prepareArgs(valueToNormalize, funcWrap) {
            let classType;
            let options;
            let arg;

            if (funcWrap) {
                arg = valueToNormalize();
                valueToNormalize = () => arg;
            } else {
                arg = valueToNormalize;
            }

            if (typeof arg === 'function') {
                classType = arg;
            } else {
                options = arg;
                classType = options.class;
            }
            
            return { classType, options, valueToNormalize };
        }

        function makeExpectations(returnedValue, classType, options)
        {
            expect(returnedValue).to.be.a('object');
            expect(returnedValue).has.property('class').equal(classType);
            if (options) {
                expect(returnedValue).to.be.equal(options);
            }
        }


        it('return undefined if arg is nullable or is not an object', function() {

            let val = normalizeBuildOptions();
            expect(val).to.be.undefined;

            val = normalizeBuildOptions(null);
            expect(val).to.be.undefined;

            val = normalizeBuildOptions(() => null);
            expect(val).to.be.undefined;

            val = normalizeBuildOptions('null');
            expect(val).to.be.undefined;

            val = normalizeBuildOptions(() => 'null');
            expect(val).to.be.undefined;
        });            

        it('should return given arg if its an object', function() {
            let obj = {};
            let val1 = normalizeBuildOptions(obj);
            let val2 = normalizeBuildOptions(() => obj);
            expect(val1).to.be.equal(obj);
            expect(val2).to.be.equal(obj);
        });

        it('should return arg if given arg is an object with function in a class property', function() {

            isPositiveReturn({ 
                class: function(){}
            });

            isPositiveReturn({ 
                class: class{}
            });

        });

        it('should return object { class: Ctor } if arg is ctor', function() {

            isPositiveReturn(String);

        });

        it('should return object { class: Ctor } if arg is a function returning Ctor', function() {

            isPositiveReturn(() => String, true);
            // let val = normalizeBuildOptions(() => String);
            // expect(val).to.be.a('object');
            // expect(val).has.property('class').equal(String);
        });

        it('should return invoked arg if given arg is a function which returns an object with function in a class property', function() {

            isPositiveReturn(() => ({ class: function(){ } }), true); 

            // let test = { class: function(){ } };
            // let val = normalizeBuildOptions(() => test);
            // expect(val).is.equal(test);
        });

     
    });
});