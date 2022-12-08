var assert = require('assert');
var ref = require("../purchaseOrder");
var sinon = require('sinon');


describe('purchaseOrder.js', function () {
    describe('Structural Testing', function () {
        describe('Test 1', function () {
            it('Return 0, balance = -5', function () {
                assert.equal(ref.getBalanceFactor({ balance: -5 }), 0); //check if balance under 0 passes 
            });
        });
        describe('Test 2', function () {
            it('Return 0, balance = 3001', function () {
                assert.equal(ref.getBalanceFactor({ balance: 3001 }), 0); //check if balance over 3000 passes 
            });
        });
        describe('Test 3', function () {
            it('Return 5, balance = 75', function () {
                assert.equal(ref.getBalanceFactor({ balance: 75 }), 5); //between 0-100
            });
        });
        describe('Test 4', function () {
            it('Return 10, balance = 300', function () {
                assert.equal(ref.getBalanceFactor({ balance: 300 }), 10); //between 100-500
            });
        });
        describe('Test 5', function () {
            it('Return 20, balance = 800', function () {
                assert.equal(ref.getBalanceFactor({ balance: 800 }), 20); //between 500 and 1000
            });
        });
        describe('Test 6', function () {
            it('Return 60, balance = 1999', function () {
                assert.equal(ref.getBalanceFactor({ balance: 1999 }), 60); //between 1000 and 2000
            });
        });
        describe('Test 7', function () {
            it('Return 100, balance = 2999', function () {
                assert.equal(ref.getBalanceFactor({ balance: 2999 }), 100); //between 2000 and 3000
            });
        });
        describe('Test 8', function () { //different fruit not in inventory
            it('Return invalid when product not found', function () {
                assert.equal(ref.productStatus("peach", [{ productName: "apple", productQuantity: 250 }], 250), "invalid");
            });
        });
        describe('Test 9', function () { //make stock = 0
            it('Return soldout if product is found, but stock = 0', function () {
                assert.equal(ref.productStatus("apple", [{ productName: "apple", productQuantity: 0 }], 250), "soldout");
            });
        });
        describe('Test 10', function () { //stock is under threshold 
            it('Return limited if product is found but stock less than inventory threshold', function () {
                assert.equal(ref.productStatus("apple", [{ productName: "apple", productQuantity: 50 }], 250), "limited");
            });
        });
        describe('Test 11', function () {  //show available 
            it('Return availble when inventory is greater than inventory theshold ', function () {
                assert.equal(ref.productStatus("apple", [{ productName: "apple", productQuantity: 300 }], 250), "available");
            });
        });
        describe('Test 12', function () {

            afterEach(function () {
                ref.accountStatus.restore();
                ref.creditStatus.restore();
                ref.productStatus.restore();
            });

            it('Return Rejected', function () { //should show rejected if all 3 are invalid 
                sinon.stub(ref, 'accountStatus').onCall(0).returns('invalid');
                sinon.stub(ref, 'creditStatus').onCall(0).returns('invalid');
                sinon.stub(ref, 'productStatus').onCall(0).returns('invalid');
                assert.equal(ref.orderHandling(), "rejected");
            });
        });
        describe('Test 13', function () {

            afterEach(function () {
                ref.accountStatus.restore();
                ref.creditStatus.restore();
                ref.productStatus.restore();
            });

            it('Return Accepted', function () { //should show as accepted if excellent, good, and available 
                sinon.stub(ref, 'accountStatus').onCall(0).returns('excellent');
                sinon.stub(ref, 'creditStatus').onCall(0).returns('good');
                sinon.stub(ref, 'productStatus').onCall(0).returns('available');
                assert.equal(ref.orderHandling(), "accepted");
            });
        });
        describe('Test 14', function () {

            afterEach(function () {
                ref.accountStatus.restore();
                ref.creditStatus.restore();
                ref.productStatus.restore();
            });

            it('Return Pending', function () { //should show pending if acceptable, poor, available 
                sinon.stub(ref, 'accountStatus').onCall(0).returns('acceptable');
                sinon.stub(ref, 'creditStatus').onCall(0).returns('poor');
                sinon.stub(ref, 'productStatus').onCall(0).returns('available');
                assert.equal(ref.orderHandling(), "pending");
            });
        });
        describe('Test 15', function () {

            afterEach(function () {
                ref.accountStatus.restore();
                ref.creditStatus.restore();
                ref.productStatus.restore();
            });

            it('Return Rejected', function () { //should show rejected
                sinon.stub(ref, 'accountStatus').onCall(0).returns(1);
                sinon.stub(ref, 'creditStatus').onCall(0).returns(2);
                sinon.stub(ref, 'productStatus').onCall(0).returns(3);
                assert.equal(ref.orderHandling(), "rejected");
            });
        });
    });
});