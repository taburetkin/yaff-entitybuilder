//import { isKnownCtor } from '../../knownCtors';

import { invokeValue } from '../../invokeValue';

describe('invokeValue', function() {
    let value;
    this.beforeEach(function() {
        value = this.sinon.spy();
    });

    it('should not invoke known ctor', function() {
        let test = invokeValue.bind(String);
        expect(test).not.to.throw().and.be.equal(String);
    });

    it('invokeValue(value, -, context) - should invoke with correct context only once', function() {
        const context = {};
        let call;

        invokeValue(value, undefined, context);
        expect(value).to.be.calledOnce.and.calledOn(context);


        invokeValue(value, null, context);
        call = value.getCall(1);
        expect(value).to.be.calledTwice;
        expect(call.calledOn(context)).to.be.true;

        invokeValue(value, [], context);
        call = value.getCall(2);
        expect(value).to.be.calledThrice;
        expect(call.calledOn(context)).to.be.true;

        invokeValue(value, 'foo', context);
        call = value.getCall(3);
        expect(value.callCount).to.be.equal(4);
        expect(call.calledOn(context)).to.be.true;


    });

    it('invokeValue(value) - should invoke only once without arguments', function() {
        invokeValue(value);
        expect(value).to.be.calledOnceWithExactly();
    });

    it('invokeValue(value, undefined) - should invoke only once without arguments', function() {
        invokeValue(value, undefined);
        expect(value).to.be.calledOnceWithExactly();
    });

    it('invokeValue(value, []) - should invoke only once without arguments', function() {
        invokeValue(value, []);
        expect(value).to.be.calledOnceWithExactly();
    });


    it('invokeValue(value, nonArrayValue) - should invoke only once with correct argument', function(){
        invokeValue(value, 'foo');
        expect(value).to.be.calledOnceWithExactly('foo');
    });

    it('invokeValue(value, ArrayValue) - should invoke only once with correct arguments', function(){
        invokeValue(value, ['foo', 'bar']);
        expect(value).to.be.calledOnceWithExactly('foo', 'bar');
    });


});