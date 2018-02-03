const obj = window;
const requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;
const URL = obj.URL || obj.webkitURL || obj.mozURL;

function onerror(message) {
    alert(message);
}

function createTempFile(callback) {
    const tmpFilename = "tmp.dat";
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

export default {
    getEntries: function (file, onend) {
        zip.createReader(new zip.BlobReader(file), function (zipReader) {
            zipReader.getEntries(onend);
        }, onerror);
    },
    getEntryFile: function (entry, creationMethod, onend, onprogress) {
        let writer, zipFileEntry;

        function getData() {
            entry.getData(writer, function (blob) {
                let blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
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
    URL,
};