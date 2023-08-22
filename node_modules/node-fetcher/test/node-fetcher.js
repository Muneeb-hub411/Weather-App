//'use strict';

var expect = require('chai').expect;
var nodeFetcher = require('../lib/node-fetcher');
var temp = require('temp');

describe('nodeFetcher', function() {

  it('downloadUrl should fail for an incorrect version', function(done) {
    nodeFetcher.download('invalidVersion','linux','x64','dummy',function(err) {
      expect(err).not.to.equal(null);
      done();
    });
  });

  it('downloadUrl should be correct for a downloadable version', function(done) {
    var url = nodeFetcher.downloadUrl('0.10.3','linux', 'x64');
    expect(url).to.contain.string('nodejs');
    expect(url).to.contain.string('linux');
    expect(url).to.contain.string('v0.10.3');
    done();
  });

  it('downloadUrl should be correct for a downloadable version with a v', function(done) {
    var url = nodeFetcher.downloadUrl('v0.10.3','linux', 'x64');
    expect(url).to.contain.string('nodejs');
    expect(url).to.contain.string('linux');
    expect(url).to.contain.string('v0.10.3');
    done();
  });

  it('downloadUrl should be correct for system', function(done) {
    var url = nodeFetcher.downloadUrl('system','linux', 'x64');
    expect(url).to.contain.string('file://');
    done();
  });

  it('should error on non existing version', function(done) {
    temp.open('node-fetcher', function(err, info) {
      var filename = info.path;
      nodeFetcher.download('0.10.9999',process.platform,'x64',filename,function(err) {
        expect(err).not.to.equal(null);
        done();
      });
    });
  });

  it('should error on non supported platform', function(done) {
    temp.open('node-fetcher', function(err, info) {
      var filename = info.path;
      nodeFetcher.download('0.10.3','unknown', 'x64',filename,function(err) {
        expect(err).not.to.equal(null);
        done();
      });
    });
  });

  it('should error on non supported platform', function(done) {
    temp.open('node-fetcher', function(err, info) {
      var filename = info.path;
      nodeFetcher.download('0.10.3','unknown', 'x64',filename,function(err) {
        expect(err).not.to.equal(null);
        done();
      });
    });
  });

  it('should download an existing version for arch x86', function(done) {
    this.timeout(90000);
    temp.open('node-fetcher', function(err, info) {
      var filename = info.path;
      nodeFetcher.download('0.10.3',process.platform,'x86',filename,function(err) {
        done(err);
      });
    });
  });

  it('should download the latest version for arch x86', function(done) {
    this.timeout(90000);
    temp.open('node-fetcher', function(err, info) {
      var filename = info.path;
      nodeFetcher.download('latest',process.platform,'x86',filename,function(err) {
        done(err);
      });
    });
  });

  it('should get the latest version', function(done) {
    temp.open('node-fetcher', function(err, info) {
      var filename = info.path;
      nodeFetcher.latestVersion(function(err,version) {
        done(err);
      });
    });
  });

  it('should download system version for arch x86', function(done) {
    temp.open('node-fetcher', function(err, info) {
      var filename = info.path;
      nodeFetcher.download('system',process.platform,'x86',filename,function(err) {
        done(err);
      });
    });
  });

  it('should download an existing version for arch x64', function(done) {
    this.timeout(90000);
    temp.open('node-fetcher', function(err, info) {
      var filename = info.path;
      nodeFetcher.download('0.10.3',process.platform,'x64',filename,function(err) {
        done(err);
      });
    });
  });


});
