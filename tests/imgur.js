var should = require('should');
var request = require('supertest');

var Imgur = require('../app/imgur');
var mock = require('../mock');
var key = '8ff16bbd77e6338';
var albumId = 'ABEs0';


describe('Imgur response parsing', function () {

    it('Should be able to parse an Imgur gallery response to an array of GIFs', function(done) {
        var imgur = new Imgur();
        var parsed = imgur.parseResp(mock.imgur.gallery);
        parsed.should.be.an.Array;
        parsed.length.should.equal(6);
        return done();
    });

    it('Should be able to parse an Imgur search response to an array of GIFs', function(done) {
        var imgur = new Imgur();
        var parsed = imgur.parseResp(mock.imgur.search);
        parsed.should.be.an.Array;
        parsed.length.should.equal(60);
        return done();
    });

    it('Should return an empty array when given a bad string', function(done) {
        var imgur = new Imgur();
        var parsed = imgur.parseResp('{asdf junk string...');
        parsed.should.be.an.Array;
        parsed.length.should.equal(0);
        return done();
    });
});

describe('Imgur service helper', function(){

    it('Searches Imgur for images, returning a parsed array', function(done){
        var imgur = new Imgur(key);
        imgur.search('taco').always(function(resp){
            resp.should.be.a.array;
            done();
        });
    });

    it('Searches Imgur for GIFs, returning a parsed array', function(done){
        var imgur = new Imgur(key);
        imgur.search('taco+ext:gif').always(function(resp){
            resp.should.be.a.array;
            resp.length.should.not.equal(0);
            done();
        });
    });

    it('Returns an empty array if nothing is found on search', function(done){
        var imgur = new Imgur(key);
        imgur.search('asdfkadsdflj +ext:gif nude bea arthur').always(function(resp){
            resp.should.be.a.array;
            resp.length.should.equal(0);
            done();
        });
    });

    it('Can return a random image from a search result', function(done){
        var imgur = new Imgur(key);
        imgur.getRandomFromSearch('taco').always(function(resp){
            resp.should.be.a.object;
            resp.link.should.be.a.string;
            done();
        });
    });

    it('Will return an object with the failed query if nothing is found', function(done){
        var query = 'dakdflakj onions rule!!dkdk';
        var imgur = new Imgur(key);
        imgur.getRandomFromSearch(query).always(function(resp){
            resp.data.should.be.a.object;
            resp.data.error.should.be.a.string;
            resp.data.query.should.equal(query);
            done();
        });
    });

    it('Returns a parsed error response if the gallery isn\'t found', function(done){
        var imgur = new Imgur(key);
        imgur.getAlbum('x').always(function(resp){
            resp.data.should.be.a.object;
            resp.data.error.should.be.a.string;
            done();
        });
    });

    it('Can find the taco gif album', function(done){
        var imgur = new Imgur(key);
        imgur.getAlbum(albumId).always(function(resp){
            resp.should.be.a.array;
            resp.length.should.not.equal(0);
            done();
        });
    });

    it('Can return a random image from the taco gif album', function(done){
        var imgur = new Imgur(key);
        imgur.getRandomFromAlbum(albumId).always(function(resp){
            resp.should.be.a.object;
            resp.link.should.be.a.string;
            done();
        });
    });

    it('Will return an error if can\'t get an image from a unkown album', function(done){
        var imgur = new Imgur(key);
        imgur.getRandomFromAlbum('x').always(function(resp){
            resp.data.should.be.a.object;
            resp.data.error.should.be.a.string;
            done();
        });
    });




});