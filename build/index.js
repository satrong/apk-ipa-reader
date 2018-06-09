'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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
        this.events = [];
    }

    (0, _createClass3.default)(_class, [{
        key: 'recordEvent',
        value: function recordEvent(eventName, dom, listener) {
            this.events.push({ eventName: eventName, dom: dom, listener: listener });
        }
    }, {
        key: 'reader',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(files, event) {
                var results, i, len;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                results = [];
                                i = 0, len = files.length;

                            case 2:
                                if (!(i < len)) {
                                    _context.next = 11;
                                    break;
                                }

                                _context.t0 = results;
                                _context.next = 6;
                                return this.readerFile(files[i]);

                            case 6:
                                _context.t1 = _context.sent;

                                _context.t0.push.call(_context.t0, _context.t1);

                            case 8:
                                i++;
                                _context.next = 2;
                                break;

                            case 11:
                                if (event && event.target) event.target.value = '';
                                this.callback(results);

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function reader(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return reader;
        }()
    }, {
        key: 'readerFile',
        value: function readerFile(file) {
            return new _promise2.default(function (resolve) {
                var r = function r(err, info) {
                    return resolve({
                        status: !err,
                        info: err,
                        data: (0, _assign2.default)({ filename: file.name, file: file }, info)
                    });
                };
                _model2.default.getEntries(file, function (entries) {
                    if (/\.apk$/i.test(file.name)) {
                        (0, _apk2.default)(entries, r);
                    } else if (/\.ipa$/i.test(file.name)) {
                        (0, _ipa2.default)(entries, r);
                    } else {
                        resolve({
                            status: false,
                            info: '只支持apk和ipa文件格式',
                            data: { filename: file.name }
                        });
                    }
                });
            });
        }

        /**
         * 通过file input获取文件
         * @param {DomObject|DomObjectArray} doms fileinput元素
         */

    }, {
        key: 'byInput',
        value: function byInput(doms, callback) {
            var _this = this;

            doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
            Array.prototype.forEach.call(doms, function (dom) {
                var cb = function cb(e) {
                    callback && callback();
                    _this.reader(dom.file, e);
                };
                dom.addEventListener('change', cb, false);
                _this.recordEvent('change', dom, cb);
            });
        }

        /**
         * 通过拖拽获取文件
         * @param {DomObject|DomObjectArray} doms fileinput元素
         * @param {Object} options {dragenter:Function, dragleave:Function}
         */

    }, {
        key: 'byDrag',
        value: function byDrag(doms, options, callback) {
            var _this2 = this;

            if (arguments.length === 2) {
                if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }
            }
            doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
            options = options || {};
            Array.prototype.forEach.call(doms, function (dom) {
                //拖进
                var dragenter = function dragenter(e) {
                    e.preventDefault();
                    options.dragenter && options.dragenter();
                };
                dom.addEventListener('dragenter', dragenter, false);
                _this2.recordEvent('dragenter', dom, dragenter);

                //拖离
                var dragleave = function dragleave(e) {
                    options.dragleave && options.dragleave(e);
                };
                dom.addEventListener('dragleave', dragleave, false);
                _this2.recordEvent('dragleave', dom, dragleave);

                var dragover = function dragover(e) {
                    return e.preventDefault();
                };
                dom.addEventListener('dragover', dragover, false);
                _this2.recordEvent('dragover', dom, dragover);

                var drop = function drop(e) {
                    e.preventDefault();
                    callback && callback();
                    _this2.reader(e.dataTransfer.files);
                };
                dom.addEventListener('drop', drop, false);
                _this2.recordEvent('drop', dom, drop);
            });
        }

        // 移除监听事件

    }, {
        key: 'removeEvent',
        value: function removeEvent() {
            this.events.forEach(function (el) {
                el.dom.removeEventListener(el.eventName, el.listener, false);
            });
        }
    }]);
    return _class;
}();

exports.default = _class;
;