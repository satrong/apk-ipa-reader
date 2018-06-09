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
            dom.addEventListener('change', e => {
                callback && callback();
                this.reader(dom.files, e);
            }, false);
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
            dom.addEventListener('dragenter', e => {
                e.preventDefault();
                options.dragenter && options.dragenter();
            }, false);

            //拖离
            dom.addEventListener('dragleave', e => {
                options.dragleave && options.dragleave(e);
            }, false);

            dom.addEventListener('dragover', e => e.preventDefault(), false);

            dom.addEventListener('drop', e => {
                e.preventDefault();
                callback && callback();
                this.reader(e.dataTransfer.files);
            }, false);
        });
    }
};