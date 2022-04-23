import 'mocha';
import { expect } from 'chai';
import { JsonObject } from '../src/index';

describe('Tests práctica 9', () => {
  it('Clase JsonObject', () => {
    let obj = new JsonObject("Hector", "RedNote", "This is a red note", "red");
    expect(obj instanceof JsonObject).to.be.equal(true);
    expect(obj.getUser()).to.be.equal('Hector');
    expect(obj.getTitle()).to.be.equal('RedNote');
    expect(obj.getBody()).to.be.equal('This is a red note');
    expect(obj.getColor()).to.be.equal('red');
  });
});