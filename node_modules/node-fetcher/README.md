# Description

A simple helper to download the nodejs binary from the `http://nodejs.org/dist`

It will download the tgz and extract the nodejs binary from it

[![Build Status](https://travis-ci.org/jedi4ever/node-fetcher.js.png)](https://travis-ci.org/jedi4ever/node-fetcher.js)

# Usage

    var nodeFetcher = require('node-fetcher');
    nodeFetcher.download('10.0.3', 'linux', 'x64', '/tmp/node', function(err) {
      // do something with the error
    });

    nodeFetcher.download('latest', 'linux', 'x64', '/tmp/node', function(err) {
      // do something with the error
    });

    nodeFetcher.download('system', 'linux', 'x64', '/tmp/node', function(err) {
      // do something with the error
    });

# Limits
It currently only supports tgz based downloads. Feel free to add the pkg or exe fetchers

# API
## download
    nodeFetcher.download(version, platform, arch, filename, callback);

downloads the specified version, platform and architecture to filename

- `version` : latest | system | _version_ (X.Y.Z - without or without the v prefix)
- `architecture` : x86 or x64
- `platform` : linux, darwin or sunos
- `filename` : path to save the nodejs binary to
- `callback` : function that will pass the err or not

## downloadURL
    nodeFetcher.downloadURL(version, platform, arch);

returns the downloadURL for the specified version, platform and architecture to filename

- `version` : (without the v prefix)
- `architecture` : x86 or x64
- `platform` : linux, darwin or sunos

# License
MIT
