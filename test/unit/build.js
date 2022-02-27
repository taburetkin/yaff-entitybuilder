import { expect } from 'chai';
import { builderConfig } from '../../builderConfig';
import { build } from '../../index';
import { addKnownCtor, knownCtors } from '../../knownCtors';

class TestClass {
    constructor(options, second) {
        Object.assign(this, options, { second });
    }
};

describe('build', function() {

    let defCtors;
    this.beforeAll(function() {
        defCtors = knownCtors.slice();
    });

    this.afterEach(function() {
        knownCtors.length = 0;
        knownCtors.push(...defCtors);
    });

    

    it('should return undefined if unexpected argument provided and builderConfig.shouldThrow is falsy', function() {
        expect(build()).to.be.undefined;
        expect(build(1)).to.be.undefined;
        expect(build('')).to.be.undefined;
        expect(build({})).to.be.undefined;
        expect(build(() => {})).to.be.undefined;
        expect(build(() => ({}))).to.be.undefined;        
    });

    it('should throw regardles of builderConfig.shouldThrow if not known class provided as argument', function() {
        expect(build.bind(null, TestClass)).to.throw();
    });

    it('should throw if unexpected argument provided and builderConfig.shouldThrow is true', function() {
        builderConfig.shouldThrow = true;
        expect(build).to.throw();
        expect(build.bind(null, 1)).to.throw();
        expect(build.bind(null, '')).to.throw();
        expect(build.bind(null, {})).to.throw();
        expect(build.bind(null, () => {})).to.throw();
        expect(build.bind(null, () => ({}))).to.throw();
        expect(build.bind(null, TestClass)).to.throw();
        builderConfig.shouldThrow = false;
    });


    it('should return argument if argument is instace of known ctor', function() {
        let inst = new String();
        let res = build(inst);
        expect(res).to.be.equal(inst);
    });


    it('should return builded instance', function() {
        addKnownCtor(TestClass);
        let opts = { class: TestClass, foo: 'bar' };
        let opts2 = { class: TestClass, ctorArguments: [ { foo: 'bar' }, 'second' ]};
        expect(build(opts)).to.be.instanceOf(TestClass);
        expect(build(opts2)).to.be.instanceOf(TestClass);
        expect(build(() => opts)).to.be.instanceOf(TestClass);
        expect(build(TestClass)).to.be.instanceOf(TestClass);
        expect(build(() => TestClass)).to.be.instanceOf(TestClass);
    });

    it('should pass options to a constructor', function() {
        let opts = { class: TestClass, foo: 'bar' };
        let opts2 = { class: TestClass, ctorArguments: [ { foo: 'bar' }, 'second' ]};
        let inst = build(opts);
        expect(inst).to.has.property('foo').equal('bar');
    });
    
    it('should pass all arguments to a constructor', function() {
        let opts = { class: TestClass, ctorArguments: [ { foo: 'bar' }, 'second' ]};
        let inst = build(opts);
        expect(inst).to.has.property('foo').equal('bar');
        expect(inst).to.has.property('second').equal('second');
    });

});