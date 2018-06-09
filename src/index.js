import './zip/zip.js';
import './zip/zip-ext.js';

import model from './model.js';
import APK from './apk.js';
import IPA from './ipa.js';

export default class {
    // @param {*} options {workerScriptsPath:String, callback:Function}
    constructor(options) {
        zip.workerScriptsPath = options.workerScriptsPath; // 设置引用 zip/inflate.js和z-worker.js的路径
        this.callback = options.callback || function () { };
        this.events = [];
    }

    recordEvent(eventName, dom, listener) {
        this.events.push({ eventName, dom, listener });
    }

    async reader(files, event) {
        const results = [];
        for (let i = 0, len = files.length; i < len; i++) {
            results.push(await this.readerFile(files[i]));
        }
        if (event && event.target) event.target.value = '';
        this.callback(results);
    }

    readerFile(file) {
        return new Promise(resolve => {
            const r = (err, info) => resolve({
                status: !err,
                info: err,
                data: Object.assign({ filename: file.name, file }, info),
            });
            model.getEntries(file, entries => {
                if (/\.apk$/i.test(file.name)) {
                    APK(entries, r);
                } else if (/\.ipa$/i.test(file.name)) {
                    IPA(entries, r);
                } else {
                    resolve({
                        status: false,
                        info: '只支持apk和ipa文件格式',
                        data: { filename: file.name },
                    });
                }
            });
        });
    }

    /**
     * 通过file input获取文件
     * @param {DomObject|DomObjectArray} doms fileinput元素
     */
    byInput(doms, callback) {
        doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
        Array.prototype.forEach.call(doms, dom => {
            const cb = e => {
                callback && callback();
                this.reader(dom.file, e);
            }
            dom.addEventListener('change', cb, false);
            this.recordEvent('change', dom, cb);
        });
    }

    /**
     * 通过拖拽获取文件
     * @param {DomObject|DomObjectArray} doms fileinput元素
     * @param {Object} options {dragenter:Function, dragleave:Function}
     */
    byDrag(doms, options, callback) {
        if (arguments.length === 2) {
            if (typeof options === 'function') {
                callback = options;
                options = {};
            }
        }
        doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
        options = options || {};
        Array.prototype.forEach.call(doms, dom => {
            //拖进
            const dragenter = e => {
                e.preventDefault();
                options.dragenter && options.dragenter();
            };
            dom.addEventListener('dragenter', dragenter, false);
            this.recordEvent('dragenter', dom, dragenter);

            //拖离
            const dragleave = e => {
                options.dragleave && options.dragleave(e);
            };
            dom.addEventListener('dragleave', dragleave, false);
            this.recordEvent('dragleave', dom, dragleave);

            const dragover = e => e.preventDefault();
            dom.addEventListener('dragover', dragover, false);
            this.recordEvent('dragover', dom, dragover);

            const drop = e => {
                e.preventDefault();
                callback && callback();
                this.reader(e.dataTransfer.files);
            };
            dom.addEventListener('drop', drop, false);
            this.recordEvent('drop', dom, drop);
        });
    }

    // 移除监听事件
    removeEvent() {
        this.events.forEach(el => {
            el.dom.removeEventListener(el.eventName, el.listener, false);
        });
    }
};