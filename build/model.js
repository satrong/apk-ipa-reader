"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var obj = window;
var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;
var URL = obj.URL || obj.webkitURL || obj.mozURL;

function onerror(message) {
    alert(message);
}

function createTempFile(callback) {
    var tmpFilename = "tmp.dat";
    requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function (filesystem) {
        function create() {
            filesystem.root.getFile(tmpFilename, {
                create: true
            }, function (zipFile) {
                callback(zipFile);
            });
        }

        filesystem.root.getFile(tmpFilename, null, function (entry) {
            entry.remove(create, create);
        }, create);
    });
}

exports.default = {
    getEntries: function getEntries(file, onend) {
        zip.createReader(new zip.BlobReader(file), function (zipReader) {
            zipReader.getEntries(onend);
        }, onerror);
    },
    getEntryFile: function getEntryFile(entry, creationMethod, onend, onprogress) {
        var writer = void 0,
            zipFileEntry = void 0;

        function getData() {
            entry.getData(writer, function (blob) {
                var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
                onend(blobURL);
            }, onprogress);
        }

        if (creationMethod == "Blob") {
            writer = new zip.BlobWriter();
            getData();
        } else {
            createTempFile(function (fileEntry) {
                zipFileEntry = fileEntry;
                writer = new zip.FileWriter(zipFileEntry);
                getData();
            });
        }
    },
    URL: URL
};