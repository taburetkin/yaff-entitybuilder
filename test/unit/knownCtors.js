import { expect } from "chai";
import { addKnownCtor, isKnownCtor, knownCtors, removeKnownCtor } from "../../knownCtors";

class TestCtor {}
class ExtendedTestCtor extends TestCtor {}
class MyString extends String {};

describe('knownCtor API', function() {
    let defCtors;

    this.beforeAll(function() {
        defCtors = knownCtors.slice();
    });

    this.afterEach(function() {
        knownCtors.length = 0;
        knownCtors.push(...defCtors);
    });

    describe('isKnownCtor', function() {

        it('should return false if passed argument missing or is not a function', function() {
            expect(isKnownCtor()).to.be.false;
            expect(isKnownCtor(null)).to.be.false;
            expect(isKnownCtor(undefined)).to.be.false;
            expect(isKnownCtor('foo')).to.be.false;
        });

        it('should return false if passed ctor is not in knownCtor array', function() {
            expect(isKnownCtor(() => {})).to.be.false;
        });

        it('should return true if passed ctor is in knownCtor array', function() {            
            knownCtors.push(TestCtor);
            expect(isKnownCtor(TestCtor)).to.be.true;
        });

        it('should return true if passed ctor is inherited from any knownCtor array', function() {            
            knownCtors.push(TestCtor);
            expect(isKnownCtor(ExtendedTestCtor)).to.be.true;
        });


    });
    
    describe('add/remove api', function() {
        describe('add', function() {
            it('should not add if argument is not a function and return undefined', function(){
                let ctor = 'foo';
                let result = addKnownCtor(ctor);
                expect(result).to.be.undefined;
                expect(knownCtors.indexOf(ctor)).to.be.equal(-1);
            });
            it('should not add if argument is already in knownCtors array and return undefined', function(){
                let ctor = String;
                expect(knownCtors.indexOf(ctor)).to.be.not.equal(-1);
                let result = addKnownCtor(ctor);
                expect(result).to.be.undefined;
            });
            it('should not add if argument is inherited from already existed ctor in knownCtors array and return undefined', function(){
                
                let ctor = MyString;
                let result = addKnownCtor(ctor);
                expect(result).to.be.undefined;
                expect(knownCtors.indexOf(ctor)).to.be.equal(-1);
            });
            it('should add if there is no such/base ctor in array and return arg', function() {
                let ctor = function() {};
                let result = addKnownCtor(ctor);
                expect(result).to.be.equal(ctor);
            });
        });
        describe('remove', function() {

            it('should remove and return removed ctor if `inherited` is falsy', function() {
                let result = removeKnownCtor(String);
                expect(result).to.be.equal(String);
            });

            it('should not remove ctor and return undefined if `inherited` is falsy and there is no exactly this ctor in array', function() {
                let len = knownCtors.length;
                let result = removeKnownCtor(MyString);
                expect(result).to.be.undefined;
                expect(len).to.be.equal(knownCtors.length);
            });
            
            it('should remove and return removed ctor if inherited is true', function() {
                addKnownCtor(TestCtor);
                let result = removeKnownCtor(TestCtor, true);
                expect(result).to.be.equal(TestCtor);
                expect(isKnownCtor(TestCtor)).to.be.false;
            });

            it('should not remove base ctor by removing inherited ctor if inherited is true', function() {
                addKnownCtor(TestCtor);
                let result = removeKnownCtor(ExtendedTestCtor, true);
                expect(result).to.be.undefined;
                expect(isKnownCtor(TestCtor)).to.be.true;
            });

            it('should remove and return removed inherited ctor if inherited is true and arg is a base ctor', function() {
                addKnownCtor(ExtendedTestCtor);
                let result = removeKnownCtor(TestCtor, true);
                expect(result).to.be.equal(ExtendedTestCtor);
                expect(isKnownCtor(ExtendedTestCtor)).to.be.false;
            });            
        });
    });
});