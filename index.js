'use strict';

var through2 = require('through2'),
  path = require('path'),
  gutil = require('gulp-util');

module.exports = function(options) {
  var extendName = options.ext;
  var outputFiles = {};
  var commonFileName = options.mergeCommon;
  var commonFileData = {};
  return through2.obj(function(file, env, cb) {
      var fileName = path.relative(file.base, file.path);
      var outfile;
      var mathes = fileName.match(/^.+?[\\\/]/);
      if (mathes) {
        outfile = mathes[0];
        outfile = outfile.substr(0, outfile.length - 1) + extendName;
      } else {
        outfile = fileName.replace(/\.[^.]+?$/, extendName);
      }
      if (!outputFiles[outfile]) {
        outputFiles[outfile] = [];
      }
      if (fileName == commonFileName) {
        commonFileData = {
          name: file.path,
          file: file
        };
      } else {
        outputFiles[outfile].push({
          name: file.path,
          file: file
        });
      }
      cb();
    },
    function(cb) {
      var filesName = Object.keys(outputFiles);
      if (filesName.length === 0) {
        return cb();
      }
      for (var i = 0; i < filesName.length; i++) {
        var filename = filesName[i]
        if (filename == commonFileName) {
          continue;
        }
        if (Object.keys(commonFileData).length !== 0) {
          if (options.mergeFirst) {
            outputFiles[filename].splice(0, 0, commonFileData);
          } else {
            outputFiles[filename].push(commonFileData);
          }
        }
        var concatFiles = outputFiles[filename];
        var concatFirstFile = concatFiles[0].file;
        var concatFileContents = concatFiles.map(function(fileObj) {
          var desc = '';
          if (options.sourceComments) {
            desc = '/** source file: ' + fileObj.name + ' **/\n';
          }
          return desc + fileObj.file.contents.toString();
        }).join(gutil.linefeed);
        var concatenatedFile = new gutil.File({
          base: concatFirstFile.base,
          cwd: concatFirstFile.cwd,
          path: path.join(concatFirstFile.base, filename),
          contents: new Buffer(concatFileContents)
        });
        this.push(concatenatedFile);
      }
      cb();
    });
};