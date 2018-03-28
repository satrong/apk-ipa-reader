'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('./zip/zip.js');

require('./zip/zip-ext.js');

var _model = require('./model.js');

var _model2 = _interopRequireDefault(_model);

var _apk = require('./apk.js');

var _apk2 = _interopRequireDefault(_apk);

var _ipa = require('./ipa.js');

var _ipa2 = _interopRequireDefault(_ipa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
    // @param {*} options {workerScriptsPath:String, callback:Function}
    function _class(options) {
        (0, _classCallCheck3.default)(this, _class);

        zip.workerScriptsPath = options.workerScriptsPath; // 设置引用 zip/inflate.js和z-worker.js的路径
        this.callback = options.callback || function () {};
        this.file = null;
    }

    (0, _createClass3.default)(_class, [{
        key: 'reader',
        value: function reader(file, callback) {
            _model2.default.getEntries(file, function (entries) {
                if (/\.apk$/i.test(file.name)) {
                    (0, _apk2.default)(entries, callback /* (err, fileinfo) */);
                } else if (/\.ipa$/i.test(file.name)) {
                    (0, _ipa2.default)(entries, callback /* (err, fileinfo) */);
                } else {
                    callback('只支持apk和ipa文件格式');
                }
            });
        }

        /**
         * 通过file input获取文件
         * @param {DomObject|DomObjectArray} doms fileinput元素
         */

    }, {
        key: 'byInput',
        value: function byInput(doms) {
            var _this = this;

            doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
            Array.prototype.forEach.call(doms, function (dom) {
                dom.addEventListener('change', function (e) {
                    _this.file = dom.files[0];
                    _this.reader(dom.files[0], _this.callback);
                    e.target.value = '';
                }, false);
            });
        }

        /**
         * 通过拖拽获取文件
         * @param {DomObject|DomObjectArray} doms fileinput元素
         * @param {Object} options {dragenter:Function, dragleave:Function}
         */

    }, {
        key: 'byDrag',
        value: function byDrag(doms, options) {
            var _this2 = this;

            doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
            options = options || {};
            Array.prototype.forEach.call(doms, function (dom) {
                //拖进
                dom.addEventListener('dragenter', function (e) {
                    e.preventDefault();
                    options.dragenter && options.dragenter();
                }, false);

                //拖离
                dom.addEventListener('dragleave', function (e) {
                    options.dragleave && options.dragleave(e);
                }, false);

                dom.addEventListener('dragover', function (e) {
                    return e.preventDefault();
                }, false);

                dom.addEventListener('drop', function (e) {
                    e.preventDefault();
                    _this2.file = e.dataTransfer.files[0];
                    _this2.reader(e.dataTransfer.files[0], _this2.callback);
                }, false);
            });
        }
    }]);
    return _class;
}();

exports.default = _class;
;