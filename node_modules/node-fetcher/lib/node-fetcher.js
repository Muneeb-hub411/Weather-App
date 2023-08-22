'use strict';

var request = require('request');
var fs = require('fs');
var zlib = require('zlib');
var Untar = require('tar-async/untar');
var async = require('async');

var tgzPlatforms = [ 'linux', 'darwin', 'sunos'];

/**
 * Method to download the node binary
 * Currently this only wraps the downloadTgz, but it might be extended for other archs
 *
 * @memberof NodeFetcher
 * @instance
 * @function download
 * @param {String} version Version you want to download (latest | system | 0.10.1 ...)
 * @param {String} platform Platform you want to download (linux|darwin|sunos)
 * @param {String} arch Architecture (x84 | x64)
 * @param {String} filename Filename where you'd like to save the node binary
 * @param {Function} callback Callback with (err) if it failed
 */
var download = function(version, platform, arch, filename, callback) {

  var downloadVersion = version;

  if (version === 'system') {
    return copyNode(filename,callback);
  } else {
    async.series([ function(callback) {
      validateVersion(version,callback);
    },
    function(callback) {
      if (version === 'latest') {
        latestVersion(function(err, version) {
          downloadVersion = version;
          return callback(err, version);
        });
      } else {
        return callback(null);
      }
    },
    function(callback) {
      if ( tgzPlatforms.indexOf(platform) >= 0) {
        return downloadTgz(downloadVersion, platform, arch, filename, callback);
      } else {
        return callback(new Error('unsupported platform ' + platform));
      }
    }
    ],function(err, results) {
      return callback(err);
    });

  }
};

var downloadPrefix = 'http://nodejs.org/dist/';

/**
 * Method to copy the system node
 * @memberof NodeFetcher
 * @function copyNode
 * @instance
 * @param {String} filename Destination filename to copy the system node to
 * @param {Function} callback Function to call(err) when done or error
 */
var copyNode = function(filename,callback) {
  var fs = require('fs');
  var systemNode = fs.createReadStream(process.execPath);
  var destNode = fs.createWriteStream(filename);

  systemNode.on('error',function(err) {
    callback(err);
  });

  destNode.on('error', function(err) {
    callback(err);
  });

  destNode.on('close', function() {
    callback(null);
  });

  systemNode.pipe(destNode);
};

/**
 * Method to generate the full downloadURL
 *
 * @memberof NodeFetcher
 * @function downloadUrl
 * @instance
 * @param {String} version Version you want to download (system | 0.10.1 ...)
 * @param {String} platform Platform you want to download (linux|darwin|sunos)
 * @param {String} arch Architecture (x84 | x64)
 * @returns {String} the full download URL
 */
var downloadUrl = function(version, platform, arch) {
  var url;

  if (version === 'system') {
    url = 'file://'+ encodeURIComponent(process.execPath);
  } else {
    // chomp leading v from versions
      version = version.replace('v','');
    if ( tgzPlatforms.indexOf(platform) >= 0) {
      url =  util.format(downloadPrefix + 'v%s/node-v%s-%s-%s.tar.gz', version, version, platform , arch );
    }
  }

  return url;
};

/**
 * Method to download the node binary
 * Currently this only wraps the downloadTgz, but it might be extended for other archs
 *
 * @memberof NodeFetcher
 * @instance
 * @function downloadTgz
 * @param {String} version Version you want to download (latest | system | 0.10.1 ...)
 * @param {String} platform Platform you want to download (linux|darwin|sunos)
 * @param {String} arch Architecture (x84 | x64)
 * @param {String} filename Filename where you'd like to save the node binary
 * @param {Function} callback Callback with (err) if it failed
 * @private
 */
var downloadTgz = function(version, platform, arch, filename, callback) {
  var self = this;
  var url = downloadUrl(version, platform, arch);

  // Prepare the download stream
  var download = request(url,function (error, response, body) {
    if (error) {
      return callback(error);
    }
  });

  // Prepare the filewrite stream
  var fileWriter = fs.createWriteStream(filename);
  fileWriter.on('error', function(error) {
    if (error) {
      return callback(error);
    }
  });

  // Prepare the gunzip stream
  var gunzip = zlib.createGunzip();
  gunzip.on('error', function(error) {
    return callback(error);
  });

  // Prepare the untar stream
  var untar = new Untar(function (err, header, fileStream) {

    if (header) {
      if (header.filename) {
        if (endsWith(header.filename,'/bin/node')) {
          //console.log(header.filename);
          fileStream.on('end', function() {
            return callback(null);
          });
          fileStream.pipe(fileWriter);
        }
      }
    }
  });

  // Start the download process
  download.pipe(gunzip).pipe(untar);
};

/**
 * Method to retrieve the latest downloadable version
 *
 * @memberof NodeFetcher
 * @instance
 * @function latestVersion
 * @param {Function} callback Callback with (err, version) if it failed
 * @private
 */
var latestVersion = function(callback) {
  var url = 'http://nodejs.org/dist/latest';

  var download = request(url,function (error, response, body) {
    if (error) {
      return callback(error);
    } else {
      var match = body.match(/>node-v([^.]*).([^.]*).([^.]*)-darwin-x64.tar.gz/);
      var version = [ match[1].toString() , match[2] , match[3] ].join('.') ;
      return callback(null, version);
    }
  });
};

/**
 * Method to check if a version is a valid nodeversion
 *
 * @memberof NodeFetcher
 * @instance
 * @function validateVersion
 * @param {Function} callback Callback with (err) if it failed
 * @private
 */

var validateVersion = function(version, callback) {
  if (version === 'latest' || version === 'system') {
    callback(null);
  } else {
    if (version.match(/v*[0-9]+.[0-9]+.[0-9]+/)) {
      callback(null);
    } else {
      callback(new Error('Incorrect version "' + version + '" specified'));
    }
  }
};

var util = require('util');


var endsWith = function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

module.exports = {
  'download': download,
  'downloadUrl': downloadUrl,
  'latestVersion' : latestVersion
};
