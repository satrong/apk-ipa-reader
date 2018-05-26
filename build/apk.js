'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (entries, callback) {
    entries.forEach(function (entry) {
        var filename = (entry.filename || '').toLowerCase();
        if (filename === 'androidmanifest.xml') manifest = entry;
        if (filename === 'resources.arsc') resources = entry;
    });

    if (manifest && resources) {
        manifest.getData(new zip.BlobWriter(manifest), function (blob1) {
            (0, _lib.ApkManifestReader)(blob1, function (fileAttr, err) {
                if (err) {
                    callback('解析文件出错了 ' + err);
                } else {
                    resources.getData(new zip.BlobWriter(resources), function (blob2) {
                        (0, _lib.parseApkinit)(blob2, fileAttr, function (attrs) {
                            fileinfo.name = attrs.label;
                            fileinfo.version = attrs.versionCode ? attrs.versionCode : "1";
                            fileinfo.versionShort = attrs.versionName ? attrs.versionName : "1.0";
                            fileinfo.id = attrs.package;
                            fileinfo.minSdkVersion = attrs.minSdkVersion;
                            fileinfo.targetSdkVersion = attrs.targetSdkVersion;
                            fileinfo.release_type = "inhouse";
                            fileinfo.icon = attrs.icon;
                            fileinfo.ext = 'apk';

                            entries.forEach(function (el) {
                                if (el.filename === fileinfo.icon) {
                                    el.getData(new zip.BlobWriter(el), function (blob3) {
                                        fileinfo.iconBlob = blob3;
                                        fileinfo.icon = (window.URL || window.webkitURL || window.mozURL).createObjectURL(blob3);
                                        callback(null, fileinfo);
                                    });
                                }
                            });
                        });
                    });
                }
            });
        });
    }
};

var _lib = require('./lib.js');

var manifest,
    resources,
    fileinfo = {};

/**
 * 处理apk包里面的文件
 * @param {Array} entries 通过zip解包后得到的文件列表
 * @param {Function} callback 回调函数
 */