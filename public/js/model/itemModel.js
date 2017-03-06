'use strict';

function itemModel(name, purchasers, payments, consumers) {
	this.name = name;
	this.purchasers = purchasers;
	this.payments = payments;
	this.consumers = consumers;
	this.active = true;
}