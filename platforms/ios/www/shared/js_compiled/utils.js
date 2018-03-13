// Generated by CoffeeScript 1.12.7
(function() {
  window.listDirectory = function(url, options, cb) {
    var fail, resolveSuccess;
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    fail = function(err) {};
    resolveSuccess = function(entry) {
      var readEntriesSuccess, reader;
      readEntriesSuccess = function(entries) {
        var i, len, names, results;
        window.entries = entries;
        names = [];
        results = [];
        for (i = 0, len = entries.length; i < len; i++) {
          entry = entries[i];
          names.push(entry.name);
          results.push(console.log(entry.name));
        }
        return results;
      };
      reader = entry.createReader();
      return reader.readEntries(readEntriesSuccess, fail);
    };
    return window.resolveLocalFileSystemURL(url, resolveSuccess, fail);
  };

  window.writeFile = function(directoryPath, fileName, content, cb) {
    var fail, resolveSuccess;
    fail = function(err) {
      return cb(err, null);
    };
    resolveSuccess = function(dirEntry) {
      var getFileOptions, getFileSuccess;
      getFileSuccess = function(fileEntry) {
        var createWriterSuccess;
        createWriterSuccess = function(writer) {
          writer.onwrite = function(evt, a) {
            return cb(null, evt.target.result);
          };
          writer.onerror = fail;
          return writer.write(content);
        };
        return fileEntry.createWriter(createWriterSuccess, fail);
      };
      getFileOptions = {
        create: true,
        exclusive: false
      };
      return dirEntry.getFile(fileName, getFileOptions, getFileSuccess, fail);
    };
    return window.resolveLocalFileSystemURL(directoryPath, resolveSuccess, fail);
  };

  window.readFile = function(directoryPath, fileName, cb) {
    var fail, resolveSuccess;
    fail = function(err) {
      return cb(err, null);
    };
    resolveSuccess = function(dirEntry) {
      var getFileSuccess;
      getFileSuccess = function(fileEntry) {
        var fileSuccess;
        fileSuccess = function(file) {
          var reader;
          reader = new FileReader();
          reader.onloadend = function(e) {
            return cb(null, this.result);
          };
          return reader.readAsText(file);
        };
        return fileEntry.file(fileSuccess, fail);
      };
      return dirEntry.getFile(fileName, {}, getFileSuccess, fail);
    };
    return window.resolveLocalFileSystemURL(directoryPath, resolveSuccess, fail);
  };

  window.removeFile = function(directoryPath, fileName, cb) {
    var resolveSuccess;
    resolveSuccess = function(dirEntry) {
      var getFileSuccess;
      getFileSuccess = function(fileEntry) {
        return fileEntry.remove(cb);
      };
      return dirEntry.getFile(fileName, {}, getFileSuccess);
    };
    return window.resolveLocalFileSystemURL(directoryPath, resolveSuccess);
  };

  window.writeDir = function(directoryPath, dirName, cb) {
    var fail, resolveSuccess;
    fail = function(err) {
      return cb(err, null);
    };
    resolveSuccess = function(dirEntry) {
      var getDirectorySuccess;
      getDirectorySuccess = function(fileEntry) {
        return console.log('created');
      };
      return dirEntry.getDirectory(dirName, {
        create: true
      }, getDirectorySuccess, fail);
    };
    return window.resolveLocalFileSystemURL(directoryPath, resolveSuccess, fail);
  };

  window.removeDir = function(directoryPath, cb) {
    var fail, resolveSuccess;
    fail = function(err) {
      return cb(err, null);
    };
    resolveSuccess = function(dirEntry) {
      var removeRecursivelySuccess;
      removeRecursivelySuccess = function() {
        return console.log('Directory removed');
      };
      return dirEntry.removeRecursively(removeRecursivelySuccess, fail);
    };
    return window.resolveLocalFileSystemURL(directoryPath, resolveSuccess, fail);
  };

  window.ensurePath = function(path, cb) {
    var createDir, fail;
    fail = function(err) {
      console.log(err);
      return cb();
    };
    createDir = function(parent, folders) {
      var getDirectorySuccess;
      getDirectorySuccess = function(dirEntry) {
        folders.shift();
        if (folders.length > 0) {
          return createDir(dirEntry, folders);
        } else {
          return cb();
        }
      };
      return parent.getDirectory(folders[0], {
        create: true
      }, getDirectorySuccess, fail);
    };
    return window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
      return createDir(dirEntry, path.split('/'));
    }, fail);
  };

  window.copyFile = function(src, dest, cb) {
    var destName, destPath, fail, resolveSrcSuccess;
    dest = dest.split('/');
    destName = dest.pop();
    destPath = dest.join('/');
    fail = function(desc) {
      return function(err) {
        console.log(err, desc, src, destPath, destName);
        return cb();
      };
    };
    resolveSrcSuccess = function(srcEntry) {
      var resolveDestSuccess;
      resolveDestSuccess = function(destDirEntry) {
        var copyFile, getFileFail, getFileSuccess;
        copyFile = function() {
          var copyToSuccess;
          copyToSuccess = function() {
            console.log('copied', destPath, destName);
            return cb();
          };
          return srcEntry.copyTo(destDirEntry, destName, copyToSuccess, fail('copy'));
        };
        getFileSuccess = function(fileEntry) {
          fileEntry.remove();
          return copyFile();
        };
        getFileFail = function() {
          return copyFile();
        };
        return destDirEntry.getFile(destName, {}, getFileSuccess, getFileFail);
      };
      return ensurePath(destPath, function() {
        return window.resolveLocalFileSystemURL(cordova.file.dataDirectory + destPath, resolveDestSuccess, fail('dest'));
      });
    };
    return window.resolveLocalFileSystemURL(src, resolveSrcSuccess, fail('src'));
  };

}).call(this);
