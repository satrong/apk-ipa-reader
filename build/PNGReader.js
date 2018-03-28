"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 输出全局对象：PNGReader
var PNGReader = void 0;
!function (a) {
    var b = {};
    var c = function c(d) {
        var e = b[d];
        if (!e) {
            e = b[d] = {};
            var f = e.exports = {};
            a[d].call(f, c, e, f, window);
        }
        return e.exports;
    };
    PNGReader = c("0");
}({
    0: function _(a, b, c, d) {
        "use strict";

        function e(a) {
            for (var b = new Uint8Array(a), c = b.byteLength / 4, d = 0; d < c; d++) {
                var e = [b[4 * d + 2], b[4 * d + 1], b[4 * d + 0], b[4 * d + 3]];
                b.set(e, 4 * d);
            }
            return b;
        }
        function f(a, b) {
            if (a.length != b.length) return !1;
            for (var c = a.length; c--;) {
                if (a[c] != b[c]) return !1;
            }return !0;
        }
        function g(a, b) {
            return (a[b] << 24) + (a[b + 1] << 16) + (a[b + 2] << 8) + (a[b + 3] << 0);
        }
        function h(a, b) {
            return a[b] << 0;
        }
        function i(a) {
            for (var b = "", c = 0; c < a.length; c++) {
                b += String.fromCharCode(a[c]);
            }return b;
        }
        var j = a("1"),
            k = "undefined" != typeof process && !process.browser,
            l = function () {
            var b = a("2");
            return function (a, c, d) {
                a = c ? b.inflateRaw(a) : b.inflate(a), d(null, a);
            };
        }(),
            m = k ? Buffer : function () {
            return "function" == typeof ArrayBuffer ? function (a) {
                return new Uint8Array(new ArrayBuffer(a));
            } : function (a) {
                return new Array(a);
            };
        }(),
            n = Array.prototype.slice,
            o = Object.prototype.toString,
            p = function p(a) {
            if ("string" == typeof a) {
                var b = a;
                a = new Array(b.length);
                for (var c = 0, d = b.length; c < d; c++) {
                    a[c] = b[c].charCodeAt(0);
                }
            } else {
                var e = o.call(a).slice(8, -1);
                "ArrayBuffer" == e && (a = new Uint8Array(a));
            }
            this.i = 0, this.bytes = a, this.png = new j(), this.dataChunks = [], this.isCgBI = !1, this.width = 0, this.height = 0;
        };
        p.prototype.readBytes = function (a) {
            var b = this.i + a;
            if (b > this.bytes.length) throw new Error("Unexpectedly reached end of file");
            var c = n.call(this.bytes, this.i, b);
            return this.i = b, c;
        }, p.prototype.decodeHeader = function () {
            if (0 !== this.i) throw new Error("file pointer should be at 0 to read the header");
            var a = this.readBytes(8);
            if (!f(a, [137, 80, 78, 71, 13, 10, 26, 10])) throw new Error("invalid PNGReader file (bad signature)");
            this.header = a;
        }, p.prototype.decodeChunk = function () {
            var a = g(this.readBytes(4), 0);
            if (a < 0) throw new Error("Bad chunk length " + (4294967295 & a));
            var b = i(this.readBytes(4));
            if (16 === this.i && "IHDR" === b) throw new Error("icon damage");
            var c = this.readBytes(a);
            this.readBytes(4);
            switch (b) {
                case "IHDR":
                    this.decodeIHDR(c);
                    break;
                case "PLTE":
                    this.decodePLTE(c);
                    break;
                case "IDAT":
                    this.decodeIDAT(c);
                    break;
                case "IEND":
                    this.decodeIEND(c);
                    break;
                case "CgBI":
                    this.decodeCgBI(c);
            }
            return b;
        }, p.prototype.decodeCgBI = function (a) {
            this.isCgBI = !0;
        }, p.prototype.decodeIHDR = function (a) {
            var b = this.png;
            this.width = g(a, 0), this.height = g(a, 4), b.setWidth(this.width), b.setHeight(this.height), b.setBitDepth(h(a, 8)), b.setColorType(h(a, 9)), b.setCompressionMethod(h(a, 10)), b.setFilterMethod(h(a, 11)), b.setInterlaceMethod(h(a, 12));
        }, p.prototype.decodePLTE = function (a) {
            this.png.setPalette(a);
        }, p.prototype.decodeIDAT = function (a) {
            this.dataChunks.push(a);
        }, p.prototype.decodeIEND = function () {}, p.prototype.decodePixels = function (a) {
            var b,
                c,
                d,
                e,
                f = this.png,
                g = this,
                h = 0;
            for (e = this.dataChunks.length; e--;) {
                h += this.dataChunks[e].length;
            }var i = new m(h);
            for (b = 0, d = 0, e = this.dataChunks.length; b < e; b++) {
                var j = this.dataChunks[b];
                for (c = 0; c < j.length; c++) {
                    i[d++] = j[c];
                }
            }
            l(i, this.isCgBI, function (b, c) {
                if (b) return a(b);
                try {
                    0 === f.getInterlaceMethod() ? g.interlaceNone(c) : g.interlaceAdam7(c);
                } catch (d) {
                    return a(d);
                }
                a();
            });
        }, p.prototype.interlaceNone = function (a) {
            for (var b, c = this.png, d = Math.max(1, c.colors * c.bitDepth / 8), f = d * c.width, g = new m(d * c.width * c.height), i = 0, j = 0; j < a.length; j += f + 1) {
                switch (b = n.call(a, j + 1, j + f + 1), h(a, j)) {
                    case 0:
                        this.unFilterNone(b, g, d, i, f);
                        break;
                    case 1:
                        this.unFilterSub(b, g, d, i, f);
                        break;
                    case 2:
                        this.unFilterUp(b, g, d, i, f);
                        break;
                    case 3:
                        this.unFilterAverage(b, g, d, i, f);
                        break;
                    case 4:
                        this.unFilterPaeth(b, g, d, i, f);
                        break;
                    default:
                        throw new Error("unkown filtered scanline");
                }
                i += f;
            }
            this.isCgBI ? c.pixels = e(g) : c.pixels = g;
        }, p.prototype.interlaceAdam7 = function (a) {
            throw new Error("Adam7 interlacing is not implemented yet");
        }, p.prototype.unFilterNone = function (a, b, c, d, e) {
            for (var f = 0, g = e; f < g; f++) {
                b[d + f] = a[f];
            }
        }, p.prototype.unFilterSub = function (a, b, c, d, e) {
            for (var f = 0; f < c; f++) {
                b[d + f] = a[f];
            }for (; f < e; f++) {
                b[d + f] = a[f] + b[d + f - c] & 255;
            }
        }, p.prototype.unFilterUp = function (a, b, c, d, e) {
            var f,
                g,
                h = 0;
            if (d - e < 0) for (; h < e; h++) {
                b[d + h] = a[h];
            } else for (; h < e; h++) {
                f = a[h], g = b[d + h - e], b[d + h] = f + g & 255;
            }
        }, p.prototype.unFilterAverage = function (a, b, c, d, e) {
            var f,
                g,
                h,
                i = 0;
            if (d - e < 0) {
                for (; i < c; i++) {
                    b[d + i] = a[i];
                }for (; i < e; i++) {
                    b[d + i] = a[i] + (b[d + i - c] >> 1) & 255;
                }
            } else {
                for (; i < c; i++) {
                    b[d + i] = a[i] + (b[d - e + i] >> 1) & 255;
                }for (; i < e; i++) {
                    f = a[i], g = b[d + i - c], h = b[d + i - e], b[d + i] = f + (g + h >> 1) & 255;
                }
            }
        }, p.prototype.unFilterPaeth = function (a, b, c, d, e) {
            var f,
                g,
                h,
                i,
                j,
                k,
                l,
                m,
                n,
                o = 0;
            if (d - e < 0) {
                for (; o < c; o++) {
                    b[d + o] = a[o];
                }for (; o < e; o++) {
                    b[d + o] = a[o] + b[d + o - c] & 255;
                }
            } else {
                for (; o < c; o++) {
                    b[d + o] = a[o] + b[d + o - e] & 255;
                }for (; o < e; o++) {
                    f = a[o], g = b[d + o - c], h = b[d + o - e], i = b[d + o - e - c], j = g + h - i, k = Math.abs(j - g), l = Math.abs(j - h), m = Math.abs(j - i), n = k <= l && k <= m ? g : l <= m ? h : i, b[d + o] = f + n & 255;
                }
            }
        }, p.prototype.parse = function (a, b) {
            "function" == typeof a && (b = a), "object" != (typeof a === "undefined" ? "undefined" : (0, _typeof3.default)(a)) && (a = {});
            try {
                for (this.decodeHeader(); this.i < this.bytes.length;) {
                    var c = this.decodeChunk();
                    if ("CgBI" != c && ("IHDR" == c && a.data === !1 || "IEND" == c)) break;
                }
                var d = this.png;
                this.decodePixels(function (a) {
                    b(a, d);
                });
            } catch (e) {
                b(e);
            }
        }, b.exports = p;
    },
    1: function _(a, b, c, d) {
        "use strict";

        var e = function e() {
            this.width = 0, this.height = 0, this.bitDepth = 0, this.colorType = 0, this.compressionMethod = 0, this.filterMethod = 0, this.interlaceMethod = 0, this.colors = 0, this.alpha = !1, this.pixelBits = 0, this.palette = null, this.pixels = null;
        };
        e.prototype.getWidth = function () {
            return this.width;
        }, e.prototype.setWidth = function (a) {
            this.width = a;
        }, e.prototype.getHeight = function () {
            return this.height;
        }, e.prototype.setHeight = function (a) {
            this.height = a;
        }, e.prototype.getBitDepth = function () {
            return this.bitDepth;
        }, e.prototype.setBitDepth = function (a) {
            if ([2, 4, 8, 16].indexOf(a) === -1) throw new Error("invalid bith depth " + a);
            this.bitDepth = a;
        }, e.prototype.getColorType = function () {
            return this.colorType;
        }, e.prototype.setColorType = function (a) {
            var b = 0,
                c = !1;
            switch (a) {
                case 0:
                    b = 1;
                    break;
                case 2:
                    b = 3;
                    break;
                case 3:
                    b = 1;
                    break;
                case 4:
                    b = 2, c = !0;
                    break;
                case 6:
                    b = 4, c = !0;
                    break;
                default:
                    throw new Error("invalid color type");
            }
            this.colors = b, this.alpha = c, this.colorType = a;
        }, e.prototype.getCompressionMethod = function () {
            return this.compressionMethod;
        }, e.prototype.setCompressionMethod = function (a) {
            if (0 !== a) throw new Error("invalid compression method " + a);
            this.compressionMethod = a;
        }, e.prototype.getFilterMethod = function () {
            return this.filterMethod;
        }, e.prototype.setFilterMethod = function (a) {
            if (0 !== a) throw new Error("invalid filter method " + a);
            this.filterMethod = a;
        }, e.prototype.getInterlaceMethod = function () {
            return this.interlaceMethod;
        }, e.prototype.setInterlaceMethod = function (a) {
            if (0 !== a && 1 !== a) throw new Error("invalid interlace method " + a);
            this.interlaceMethod = a;
        }, e.prototype.setPalette = function (a) {
            if (a.length % 3 !== 0) throw new Error("incorrect PLTE chunk length");
            if (a.length > 3 * Math.pow(2, this.bitDepth)) throw new Error("palette has more colors than 2^bitdepth");
            this.palette = a;
        }, e.prototype.getPalette = function () {
            return this.palette;
        }, e.prototype.getPixel = function (a, b) {
            if (!this.pixels) throw new Error("pixel data is empty");
            if (a >= this.width || b >= this.height) throw new Error("x,y position out of bound");
            var c = this.colors * this.bitDepth / 8 * (b * this.width + a),
                d = this.pixels;
            switch (this.colorType) {
                case 0:
                    return [d[c], d[c], d[c], 255];
                case 2:
                    return [d[c], d[c + 1], d[c + 2], 255];
                case 3:
                    return [this.palette[3 * d[c] + 0], this.palette[3 * d[c] + 1], this.palette[3 * d[c] + 2], 255];
                case 4:
                    return [d[c], d[c], d[c], d[c + 1]];
                case 6:
                    return [d[c], d[c + 1], d[c + 2], d[c + 3]];
            }
        }, b.exports = e;
    },
    2: function _(a, b, c, d) {
        "use strict";

        var e = a("3").assign,
            f = a("4"),
            g = a("c"),
            h = a("g"),
            i = {};
        e(i, f, g, h), b.exports = i;
    },
    3: function _(a, b, c, d) {
        "use strict";

        var e = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
        c.assign = function (a) {
            for (var b = Array.prototype.slice.call(arguments, 1); b.length;) {
                var c = b.shift();
                if (c) {
                    if ("object" != (typeof c === "undefined" ? "undefined" : (0, _typeof3.default)(c))) throw new TypeError(c + "must be non-object");
                    for (var d in c) {
                        c.hasOwnProperty(d) && (a[d] = c[d]);
                    }
                }
            }
            return a;
        }, c.shrinkBuf = function (a, b) {
            return a.length === b ? a : a.subarray ? a.subarray(0, b) : (a.length = b, a);
        };
        var f = {
            arraySet: function arraySet(a, b, c, d, e) {
                if (b.subarray && a.subarray) return void a.set(b.subarray(c, c + d), e);
                for (var f = 0; f < d; f++) {
                    a[e + f] = b[c + f];
                }
            },
            flattenChunks: function flattenChunks(a) {
                var b, c, d, e, f, g;
                for (d = 0, b = 0, c = a.length; b < c; b++) {
                    d += a[b].length;
                }for (g = new Uint8Array(d), e = 0, b = 0, c = a.length; b < c; b++) {
                    f = a[b], g.set(f, e), e += f.length;
                }return g;
            }
        },
            g = {
            arraySet: function arraySet(a, b, c, d, e) {
                for (var f = 0; f < d; f++) {
                    a[e + f] = b[c + f];
                }
            },
            flattenChunks: function flattenChunks(a) {
                return [].concat.apply([], a);
            }
        };
        c.setTyped = function (a) {
            a ? (c.Buf8 = Uint8Array, c.Buf16 = Uint16Array, c.Buf32 = Int32Array, c.assign(c, f)) : (c.Buf8 = Array, c.Buf16 = Array, c.Buf32 = Array, c.assign(c, g));
        }, c.setTyped(e);
    },
    4: function _(a, b, c, d) {
        "use strict";

        function e(a, b) {
            var c = new t(b);
            if (c.push(a, !0), c.err) throw c.msg;
            return c.result;
        }
        function f(a, b) {
            return b = b || {}, b.raw = !0, e(a, b);
        }
        function g(a, b) {
            return b = b || {}, b.gzip = !0, e(a, b);
        }
        var h = a("5"),
            i = a("3"),
            j = a("a"),
            k = a("9"),
            l = a("b"),
            m = 0,
            n = 4,
            o = 0,
            p = 1,
            q = -1,
            r = 0,
            s = 8,
            t = function t(a) {
            this.options = i.assign({
                level: q,
                method: s,
                chunkSize: 16384,
                windowBits: 15,
                memLevel: 8,
                strategy: r,
                to: ""
            }, a || {});
            var b = this.options;
            b.raw && b.windowBits > 0 ? b.windowBits = -b.windowBits : b.gzip && b.windowBits > 0 && b.windowBits < 16 && (b.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new l(), this.strm.avail_out = 0;
            var c = h.deflateInit2(this.strm, b.level, b.method, b.windowBits, b.memLevel, b.strategy);
            if (c !== o) throw new Error(k[c]);
            b.header && h.deflateSetHeader(this.strm, b.header);
        };
        t.prototype.push = function (a, b) {
            var c,
                d,
                e = this.strm,
                f = this.options.chunkSize;
            if (this.ended) return !1;
            d = b === ~~b ? b : b === !0 ? n : m, "string" == typeof a ? e.input = j.string2buf(a) : e.input = a, e.next_in = 0, e.avail_in = e.input.length;
            do {
                if (0 === e.avail_out && (e.output = new i.Buf8(f), e.next_out = 0, e.avail_out = f), c = h.deflate(e, d), c !== p && c !== o) return this.onEnd(c), this.ended = !0, !1;
                (0 === e.avail_out || 0 === e.avail_in && d === n) && ("string" === this.options.to ? this.onData(j.buf2binstring(i.shrinkBuf(e.output, e.next_out))) : this.onData(i.shrinkBuf(e.output, e.next_out)));
            } while ((e.avail_in > 0 || 0 === e.avail_out) && c !== p);return d !== n || (c = h.deflateEnd(this.strm), this.onEnd(c), this.ended = !0, c === o);
        }, t.prototype.onData = function (a) {
            this.chunks.push(a);
        }, t.prototype.onEnd = function (a) {
            a === o && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
        }, c.Deflate = t, c.deflate = e, c.deflateRaw = f, c.gzip = g;
    },
    5: function _(a, b, c, d) {
        "use strict";

        function e(a, b) {
            return a.msg = H[b], b;
        }
        function f(a) {
            return (a << 1) - (a > 4 ? 9 : 0);
        }
        function g(a) {
            for (var b = a.length; --b >= 0;) {
                a[b] = 0;
            }
        }
        function h(a) {
            var b = a.state,
                c = b.pending;
            c > a.avail_out && (c = a.avail_out), 0 !== c && (D.arraySet(a.output, b.pending_buf, b.pending_out, c, a.next_out), a.next_out += c, b.pending_out += c, a.total_out += c, a.avail_out -= c, b.pending -= c, 0 === b.pending && (b.pending_out = 0));
        }
        function i(a, b) {
            E._tr_flush_block(a, a.block_start >= 0 ? a.block_start : -1, a.strstart - a.block_start, b), a.block_start = a.strstart, h(a.strm);
        }
        function j(a, b) {
            a.pending_buf[a.pending++] = b;
        }
        function k(a, b) {
            a.pending_buf[a.pending++] = b >>> 8 & 255, a.pending_buf[a.pending++] = 255 & b;
        }
        function l(a, b, c, d) {
            var e = a.avail_in;
            return e > d && (e = d), 0 === e ? 0 : (a.avail_in -= e, D.arraySet(b, a.input, a.next_in, e, c), 1 === a.state.wrap ? a.adler = F(a.adler, b, e, c) : 2 === a.state.wrap && (a.adler = G(a.adler, b, e, c)), a.next_in += e, a.total_in += e, e);
        }
        function m(a, b) {
            var c,
                d,
                e = a.max_chain_length,
                f = a.strstart,
                g = a.prev_length,
                h = a.nice_match,
                i = a.strstart > a.w_size - ka ? a.strstart - (a.w_size - ka) : 0,
                j = a.window,
                k = a.w_mask,
                l = a.prev,
                m = a.strstart + ja,
                n = j[f + g - 1],
                o = j[f + g];
            a.prev_length >= a.good_match && (e >>= 2), h > a.lookahead && (h = a.lookahead);
            do {
                if (c = b, j[c + g] === o && j[c + g - 1] === n && j[c] === j[f] && j[++c] === j[f + 1]) {
                    f += 2, c++;
                    do {} while (j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && f < m);if (d = ja - (m - f), f = m - ja, d > g) {
                        if (a.match_start = b, g = d, d >= h) break;
                        n = j[f + g - 1], o = j[f + g];
                    }
                }
            } while ((b = l[b & k]) > i && 0 !== --e);return g <= a.lookahead ? g : a.lookahead;
        }
        function n(a) {
            var b,
                c,
                d,
                e,
                f,
                g = a.w_size;
            do {
                if (e = a.window_size - a.lookahead - a.strstart, a.strstart >= g + (g - ka)) {
                    D.arraySet(a.window, a.window, g, g, 0), a.match_start -= g, a.strstart -= g, a.block_start -= g, c = a.hash_size, b = c;
                    do {
                        d = a.head[--b], a.head[b] = d >= g ? d - g : 0;
                    } while (--c);c = g, b = c;
                    do {
                        d = a.prev[--b], a.prev[b] = d >= g ? d - g : 0;
                    } while (--c);e += g;
                }
                if (0 === a.strm.avail_in) break;
                if (c = l(a.strm, a.window, a.strstart + a.lookahead, e), a.lookahead += c, a.lookahead + a.insert >= ia) for (f = a.strstart - a.insert, a.ins_h = a.window[f], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[f + 1]) & a.hash_mask; a.insert && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[f + ia - 1]) & a.hash_mask, a.prev[f & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = f, f++, a.insert--, !(a.lookahead + a.insert < ia));) {}
            } while (a.lookahead < ka && 0 !== a.strm.avail_in);
        }
        function o(a, b) {
            var c = 65535;
            for (c > a.pending_buf_size - 5 && (c = a.pending_buf_size - 5);;) {
                if (a.lookahead <= 1) {
                    if (n(a), 0 === a.lookahead && b === I) return ta;
                    if (0 === a.lookahead) break;
                }
                a.strstart += a.lookahead, a.lookahead = 0;
                var d = a.block_start + c;
                if ((0 === a.strstart || a.strstart >= d) && (a.lookahead = a.strstart - d, a.strstart = d, i(a, !1), 0 === a.strm.avail_out)) return ta;
                if (a.strstart - a.block_start >= a.w_size - ka && (i(a, !1), 0 === a.strm.avail_out)) return ta;
            }
            return a.insert = 0, b === L ? (i(a, !0), 0 === a.strm.avail_out ? va : wa) : a.strstart > a.block_start && (i(a, !1), 0 === a.strm.avail_out) ? ta : ta;
        }
        function p(a, b) {
            for (var c, d;;) {
                if (a.lookahead < ka) {
                    if (n(a), a.lookahead < ka && b === I) return ta;
                    if (0 === a.lookahead) break;
                }
                if (c = 0, a.lookahead >= ia && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ia - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), 0 !== c && a.strstart - c <= a.w_size - ka && (a.match_length = m(a, c)), a.match_length >= ia) {
                    if (d = E._tr_tally(a, a.strstart - a.match_start, a.match_length - ia), a.lookahead -= a.match_length, a.match_length <= a.max_lazy_match && a.lookahead >= ia) {
                        a.match_length--;
                        do {
                            a.strstart++, a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ia - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart;
                        } while (0 !== --a.match_length);a.strstart++;
                    } else a.strstart += a.match_length, a.match_length = 0, a.ins_h = a.window[a.strstart], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 1]) & a.hash_mask;
                } else d = E._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++;
                if (d && (i(a, !1), 0 === a.strm.avail_out)) return ta;
            }
            return a.insert = a.strstart < ia - 1 ? a.strstart : ia - 1, b === L ? (i(a, !0), 0 === a.strm.avail_out ? va : wa) : a.last_lit && (i(a, !1), 0 === a.strm.avail_out) ? ta : ua;
        }
        function q(a, b) {
            for (var c, d, e;;) {
                if (a.lookahead < ka) {
                    if (n(a), a.lookahead < ka && b === I) return ta;
                    if (0 === a.lookahead) break;
                }
                if (c = 0, a.lookahead >= ia && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ia - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), a.prev_length = a.match_length, a.prev_match = a.match_start, a.match_length = ia - 1, 0 !== c && a.prev_length < a.max_lazy_match && a.strstart - c <= a.w_size - ka && (a.match_length = m(a, c), a.match_length <= 5 && (a.strategy === T || a.match_length === ia && a.strstart - a.match_start > 4096) && (a.match_length = ia - 1)), a.prev_length >= ia && a.match_length <= a.prev_length) {
                    e = a.strstart + a.lookahead - ia, d = E._tr_tally(a, a.strstart - 1 - a.prev_match, a.prev_length - ia), a.lookahead -= a.prev_length - 1, a.prev_length -= 2;
                    do {
                        ++a.strstart <= e && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ia - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart);
                    } while (0 !== --a.prev_length);if (a.match_available = 0, a.match_length = ia - 1, a.strstart++, d && (i(a, !1), 0 === a.strm.avail_out)) return ta;
                } else if (a.match_available) {
                    if (d = E._tr_tally(a, 0, a.window[a.strstart - 1]), d && i(a, !1), a.strstart++, a.lookahead--, 0 === a.strm.avail_out) return ta;
                } else a.match_available = 1, a.strstart++, a.lookahead--;
            }
            return a.match_available && (d = E._tr_tally(a, 0, a.window[a.strstart - 1]), a.match_available = 0), a.insert = a.strstart < ia - 1 ? a.strstart : ia - 1, b === L ? (i(a, !0), 0 === a.strm.avail_out ? va : wa) : a.last_lit && (i(a, !1), 0 === a.strm.avail_out) ? ta : ua;
        }
        function r(a, b) {
            for (var c, d, e, f, g = a.window;;) {
                if (a.lookahead <= ja) {
                    if (n(a), a.lookahead <= ja && b === I) return ta;
                    if (0 === a.lookahead) break;
                }
                if (a.match_length = 0, a.lookahead >= ia && a.strstart > 0 && (e = a.strstart - 1, d = g[e], d === g[++e] && d === g[++e] && d === g[++e])) {
                    f = a.strstart + ja;
                    do {} while (d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && e < f);a.match_length = ja - (f - e), a.match_length > a.lookahead && (a.match_length = a.lookahead);
                }
                if (a.match_length >= ia ? (c = E._tr_tally(a, 1, a.match_length - ia), a.lookahead -= a.match_length, a.strstart += a.match_length, a.match_length = 0) : (c = E._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++), c && (i(a, !1), 0 === a.strm.avail_out)) return ta;
            }
            return a.insert = 0, b === L ? (i(a, !0), 0 === a.strm.avail_out ? va : wa) : a.last_lit && (i(a, !1), 0 === a.strm.avail_out) ? ta : ua;
        }
        function s(a, b) {
            for (var c;;) {
                if (0 === a.lookahead && (n(a), 0 === a.lookahead)) {
                    if (b === I) return ta;
                    break;
                }
                if (a.match_length = 0, c = E._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++, c && (i(a, !1), 0 === a.strm.avail_out)) return ta;
            }
            return a.insert = 0, b === L ? (i(a, !0), 0 === a.strm.avail_out ? va : wa) : a.last_lit && (i(a, !1), 0 === a.strm.avail_out) ? ta : ua;
        }
        function t(a) {
            a.window_size = 2 * a.w_size, g(a.head), a.max_lazy_match = C[a.level].max_lazy, a.good_match = C[a.level].good_length, a.nice_match = C[a.level].nice_length, a.max_chain_length = C[a.level].max_chain, a.strstart = 0, a.block_start = 0, a.lookahead = 0, a.insert = 0, a.match_length = a.prev_length = ia - 1, a.match_available = 0, a.ins_h = 0;
        }
        function u() {
            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Z, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new D.Buf16(2 * ga), this.dyn_dtree = new D.Buf16(2 * (2 * ea + 1)), this.bl_tree = new D.Buf16(2 * (2 * fa + 1)), g(this.dyn_ltree), g(this.dyn_dtree), g(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new D.Buf16(ha + 1), this.heap = new D.Buf16(2 * da + 1), g(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new D.Buf16(2 * da + 1), g(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function v(a) {
            var b;
            return a && a.state ? (a.total_in = a.total_out = 0, a.data_type = Y, b = a.state, b.pending = 0, b.pending_out = 0, b.wrap < 0 && (b.wrap = -b.wrap), b.status = b.wrap ? ma : ra, a.adler = 2 === b.wrap ? 0 : 1, b.last_flush = I, E._tr_init(b), N) : e(a, P);
        }
        function w(a) {
            var b = v(a);
            return b === N && t(a.state), b;
        }
        function x(a, b) {
            return a && a.state ? 2 !== a.state.wrap ? P : (a.state.gzhead = b, N) : P;
        }
        function y(a, b, c, d, f, g) {
            if (!a) return P;
            var h = 1;
            if (b === S && (b = 6), d < 0 ? (h = 0, d = -d) : d > 15 && (h = 2, d -= 16), f < 1 || f > $ || c !== Z || d < 8 || d > 15 || b < 0 || b > 9 || g < 0 || g > W) return e(a, P);
            8 === d && (d = 9);
            var i = new u();
            return a.state = i, i.strm = a, i.wrap = h, i.gzhead = null, i.w_bits = d, i.w_size = 1 << i.w_bits, i.w_mask = i.w_size - 1, i.hash_bits = f + 7, i.hash_size = 1 << i.hash_bits, i.hash_mask = i.hash_size - 1, i.hash_shift = ~~((i.hash_bits + ia - 1) / ia), i.window = new D.Buf8(2 * i.w_size), i.head = new D.Buf16(i.hash_size), i.prev = new D.Buf16(i.w_size), i.lit_bufsize = 1 << f + 6, i.pending_buf_size = 4 * i.lit_bufsize, i.pending_buf = new D.Buf8(i.pending_buf_size), i.d_buf = i.lit_bufsize >> 1, i.l_buf = 3 * i.lit_bufsize, i.level = b, i.strategy = g, i.method = c, w(a);
        }
        function z(a, b) {
            return y(a, b, Z, _, aa, X);
        }
        function A(a, b) {
            var c, d, i, l;
            if (!a || !a.state || b > M || b < 0) return a ? e(a, P) : P;
            if (d = a.state, !a.output || !a.input && 0 !== a.avail_in || d.status === sa && b !== L) return e(a, 0 === a.avail_out ? R : P);
            if (d.strm = a, c = d.last_flush, d.last_flush = b, d.status === ma) if (2 === d.wrap) a.adler = 0, j(d, 31), j(d, 139), j(d, 8), d.gzhead ? (j(d, (d.gzhead.text ? 1 : 0) + (d.gzhead.hcrc ? 2 : 0) + (d.gzhead.extra ? 4 : 0) + (d.gzhead.name ? 8 : 0) + (d.gzhead.comment ? 16 : 0)), j(d, 255 & d.gzhead.time), j(d, d.gzhead.time >> 8 & 255), j(d, d.gzhead.time >> 16 & 255), j(d, d.gzhead.time >> 24 & 255), j(d, 9 === d.level ? 2 : d.strategy >= U || d.level < 2 ? 4 : 0), j(d, 255 & d.gzhead.os), d.gzhead.extra && d.gzhead.extra.length && (j(d, 255 & d.gzhead.extra.length), j(d, d.gzhead.extra.length >> 8 & 255)), d.gzhead.hcrc && (a.adler = G(a.adler, d.pending_buf, d.pending, 0)), d.gzindex = 0, d.status = na) : (j(d, 0), j(d, 0), j(d, 0), j(d, 0), j(d, 0), j(d, 9 === d.level ? 2 : d.strategy >= U || d.level < 2 ? 4 : 0), j(d, xa), d.status = ra);else {
                var m = Z + (d.w_bits - 8 << 4) << 8,
                    n = -1;
                n = d.strategy >= U || d.level < 2 ? 0 : d.level < 6 ? 1 : 6 === d.level ? 2 : 3, m |= n << 6, 0 !== d.strstart && (m |= la), m += 31 - m % 31, d.status = ra, k(d, m), 0 !== d.strstart && (k(d, a.adler >>> 16), k(d, 65535 & a.adler)), a.adler = 1;
            }
            if (d.status === na) if (d.gzhead.extra) {
                for (i = d.pending; d.gzindex < (65535 & d.gzhead.extra.length) && (d.pending !== d.pending_buf_size || (d.gzhead.hcrc && d.pending > i && (a.adler = G(a.adler, d.pending_buf, d.pending - i, i)), h(a), i = d.pending, d.pending !== d.pending_buf_size));) {
                    j(d, 255 & d.gzhead.extra[d.gzindex]), d.gzindex++;
                }d.gzhead.hcrc && d.pending > i && (a.adler = G(a.adler, d.pending_buf, d.pending - i, i)), d.gzindex === d.gzhead.extra.length && (d.gzindex = 0, d.status = oa);
            } else d.status = oa;
            if (d.status === oa) if (d.gzhead.name) {
                i = d.pending;
                do {
                    if (d.pending === d.pending_buf_size && (d.gzhead.hcrc && d.pending > i && (a.adler = G(a.adler, d.pending_buf, d.pending - i, i)), h(a), i = d.pending, d.pending === d.pending_buf_size)) {
                        l = 1;
                        break;
                    }
                    l = d.gzindex < d.gzhead.name.length ? 255 & d.gzhead.name.charCodeAt(d.gzindex++) : 0, j(d, l);
                } while (0 !== l);d.gzhead.hcrc && d.pending > i && (a.adler = G(a.adler, d.pending_buf, d.pending - i, i)), 0 === l && (d.gzindex = 0, d.status = pa);
            } else d.status = pa;
            if (d.status === pa) if (d.gzhead.comment) {
                i = d.pending;
                do {
                    if (d.pending === d.pending_buf_size && (d.gzhead.hcrc && d.pending > i && (a.adler = G(a.adler, d.pending_buf, d.pending - i, i)), h(a), i = d.pending, d.pending === d.pending_buf_size)) {
                        l = 1;
                        break;
                    }
                    l = d.gzindex < d.gzhead.comment.length ? 255 & d.gzhead.comment.charCodeAt(d.gzindex++) : 0, j(d, l);
                } while (0 !== l);d.gzhead.hcrc && d.pending > i && (a.adler = G(a.adler, d.pending_buf, d.pending - i, i)), 0 === l && (d.status = qa);
            } else d.status = qa;
            if (d.status === qa && (d.gzhead.hcrc ? (d.pending + 2 > d.pending_buf_size && h(a), d.pending + 2 <= d.pending_buf_size && (j(d, 255 & a.adler), j(d, a.adler >> 8 & 255), a.adler = 0, d.status = ra)) : d.status = ra), 0 !== d.pending) {
                if (h(a), 0 === a.avail_out) return d.last_flush = -1, N;
            } else if (0 === a.avail_in && f(b) <= f(c) && b !== L) return e(a, R);
            if (d.status === sa && 0 !== a.avail_in) return e(a, R);
            if (0 !== a.avail_in || 0 !== d.lookahead || b !== I && d.status !== sa) {
                var o = d.strategy === U ? s(d, b) : d.strategy === V ? r(d, b) : C[d.level].func(d, b);
                if (o !== va && o !== wa || (d.status = sa), o === ta || o === va) return 0 === a.avail_out && (d.last_flush = -1), N;
                if (o === ua && (b === J ? E._tr_align(d) : b !== M && (E._tr_stored_block(d, 0, 0, !1), b === K && (g(d.head), 0 === d.lookahead && (d.strstart = 0, d.block_start = 0, d.insert = 0))), h(a), 0 === a.avail_out)) return d.last_flush = -1, N;
            }
            return b !== L ? N : d.wrap <= 0 ? O : (2 === d.wrap ? (j(d, 255 & a.adler), j(d, a.adler >> 8 & 255), j(d, a.adler >> 16 & 255), j(d, a.adler >> 24 & 255), j(d, 255 & a.total_in), j(d, a.total_in >> 8 & 255), j(d, a.total_in >> 16 & 255), j(d, a.total_in >> 24 & 255)) : (k(d, a.adler >>> 16), k(d, 65535 & a.adler)), h(a), d.wrap > 0 && (d.wrap = -d.wrap), 0 !== d.pending ? N : O);
        }
        function B(a) {
            var b;
            return a && a.state ? (b = a.state.status, b !== ma && b !== na && b !== oa && b !== pa && b !== qa && b !== ra && b !== sa ? e(a, P) : (a.state = null, b === ra ? e(a, Q) : N)) : P;
        }
        var C,
            D = a("3"),
            E = a("6"),
            F = a("7"),
            G = a("8"),
            H = a("9"),
            I = 0,
            J = 1,
            K = 3,
            L = 4,
            M = 5,
            N = 0,
            O = 1,
            P = -2,
            Q = -3,
            R = -5,
            S = -1,
            T = 1,
            U = 2,
            V = 3,
            W = 4,
            X = 0,
            Y = 2,
            Z = 8,
            $ = 9,
            _ = 15,
            aa = 8,
            ba = 29,
            ca = 256,
            da = ca + 1 + ba,
            ea = 30,
            fa = 19,
            ga = 2 * da + 1,
            ha = 15,
            ia = 3,
            ja = 258,
            ka = ja + ia + 1,
            la = 32,
            ma = 42,
            na = 69,
            oa = 73,
            pa = 91,
            qa = 103,
            ra = 113,
            sa = 666,
            ta = 1,
            ua = 2,
            va = 3,
            wa = 4,
            xa = 3,
            ya = function ya(a, b, c, d, e) {
            this.good_length = a, this.max_lazy = b, this.nice_length = c, this.max_chain = d, this.func = e;
        };
        C = [new ya(0, 0, 0, 0, o), new ya(4, 4, 8, 4, p), new ya(4, 5, 16, 8, p), new ya(4, 6, 32, 32, p), new ya(4, 4, 16, 16, q), new ya(8, 16, 32, 32, q), new ya(8, 16, 128, 128, q), new ya(8, 32, 128, 256, q), new ya(32, 128, 258, 1024, q), new ya(32, 258, 258, 4096, q)], c.deflateInit = z, c.deflateInit2 = y, c.deflateReset = w, c.deflateResetKeep = v, c.deflateSetHeader = x, c.deflate = A, c.deflateEnd = B, c.deflateInfo = "pako deflate (from Nodeca project)";
    },
    6: function _(a, b, c, d) {
        "use strict";

        function e(a) {
            for (var b = a.length; --b >= 0;) {
                a[b] = 0;
            }
        }
        function f(a) {
            return a < 256 ? ha[a] : ha[256 + (a >>> 7)];
        }
        function g(a, b) {
            a.pending_buf[a.pending++] = 255 & b, a.pending_buf[a.pending++] = b >>> 8 & 255;
        }
        function h(a, b, c) {
            a.bi_valid > W - c ? (a.bi_buf |= b << a.bi_valid & 65535, g(a, a.bi_buf), a.bi_buf = b >> W - a.bi_valid, a.bi_valid += c - W) : (a.bi_buf |= b << a.bi_valid & 65535, a.bi_valid += c);
        }
        function i(a, b, c) {
            h(a, c[2 * b], c[2 * b + 1]);
        }
        function j(a, b) {
            var c = 0;
            do {
                c |= 1 & a, a >>>= 1, c <<= 1;
            } while (--b > 0);return c >>> 1;
        }
        function k(a) {
            16 === a.bi_valid ? (g(a, a.bi_buf), a.bi_buf = 0, a.bi_valid = 0) : a.bi_valid >= 8 && (a.pending_buf[a.pending++] = 255 & a.bi_buf, a.bi_buf >>= 8, a.bi_valid -= 8);
        }
        function l(a, b) {
            var c,
                d,
                e,
                f,
                g,
                h,
                i = b.dyn_tree,
                j = b.max_code,
                k = b.stat_desc.static_tree,
                l = b.stat_desc.has_stree,
                m = b.stat_desc.extra_bits,
                n = b.stat_desc.extra_base,
                o = b.stat_desc.max_length,
                p = 0;
            for (f = 0; f <= V; f++) {
                a.bl_count[f] = 0;
            }for (i[2 * a.heap[a.heap_max] + 1] = 0, c = a.heap_max + 1; c < U; c++) {
                d = a.heap[c], f = i[2 * i[2 * d + 1] + 1] + 1, f > o && (f = o, p++), i[2 * d + 1] = f, d > j || (a.bl_count[f]++, g = 0, d >= n && (g = m[d - n]), h = i[2 * d], a.opt_len += h * (f + g), l && (a.static_len += h * (k[2 * d + 1] + g)));
            }if (0 !== p) {
                do {
                    for (f = o - 1; 0 === a.bl_count[f];) {
                        f--;
                    }a.bl_count[f]--, a.bl_count[f + 1] += 2, a.bl_count[o]--, p -= 2;
                } while (p > 0);for (f = o; 0 !== f; f--) {
                    for (d = a.bl_count[f]; 0 !== d;) {
                        e = a.heap[--c], e > j || (i[2 * e + 1] !== f && (a.opt_len += (f - i[2 * e + 1]) * i[2 * e], i[2 * e + 1] = f), d--);
                    }
                }
            }
        }
        function m(a, b, c) {
            var d,
                e,
                f = new Array(V + 1),
                g = 0;
            for (d = 1; d <= V; d++) {
                f[d] = g = g + c[d - 1] << 1;
            }for (e = 0; e <= b; e++) {
                var h = a[2 * e + 1];
                0 !== h && (a[2 * e] = j(f[h]++, h));
            }
        }
        function n() {
            var a,
                b,
                c,
                d,
                e,
                f = new Array(V + 1);
            for (c = 0, d = 0; d < P - 1; d++) {
                for (ja[d] = c, a = 0; a < 1 << aa[d]; a++) {
                    ia[c++] = d;
                }
            }for (ia[c - 1] = d, e = 0, d = 0; d < 16; d++) {
                for (ka[d] = e, a = 0; a < 1 << ba[d]; a++) {
                    ha[e++] = d;
                }
            }for (e >>= 7; d < S; d++) {
                for (ka[d] = e << 7, a = 0; a < 1 << ba[d] - 7; a++) {
                    ha[256 + e++] = d;
                }
            }for (b = 0; b <= V; b++) {
                f[b] = 0;
            }for (a = 0; a <= 143;) {
                fa[2 * a + 1] = 8, a++, f[8]++;
            }for (; a <= 255;) {
                fa[2 * a + 1] = 9, a++, f[9]++;
            }for (; a <= 279;) {
                fa[2 * a + 1] = 7, a++, f[7]++;
            }for (; a <= 287;) {
                fa[2 * a + 1] = 8, a++, f[8]++;
            }for (m(fa, R + 1, f), a = 0; a < S; a++) {
                ga[2 * a + 1] = 5, ga[2 * a] = j(a, 5);
            }la = new oa(fa, aa, Q + 1, R, V), ma = new oa(ga, ba, 0, S, V), na = new oa(new Array(0), ca, 0, T, X);
        }
        function o(a) {
            var b;
            for (b = 0; b < R; b++) {
                a.dyn_ltree[2 * b] = 0;
            }for (b = 0; b < S; b++) {
                a.dyn_dtree[2 * b] = 0;
            }for (b = 0; b < T; b++) {
                a.bl_tree[2 * b] = 0;
            }a.dyn_ltree[2 * Y] = 1, a.opt_len = a.static_len = 0, a.last_lit = a.matches = 0;
        }
        function p(a) {
            a.bi_valid > 8 ? g(a, a.bi_buf) : a.bi_valid > 0 && (a.pending_buf[a.pending++] = a.bi_buf), a.bi_buf = 0, a.bi_valid = 0;
        }
        function q(a, b, c, d) {
            p(a), d && (g(a, c), g(a, ~c)), F.arraySet(a.pending_buf, a.window, b, c, a.pending), a.pending += c;
        }
        function r(a, b, c, d) {
            var e = 2 * b,
                f = 2 * c;
            return a[e] < a[f] || a[e] === a[f] && d[b] <= d[c];
        }
        function s(a, b, c) {
            for (var d = a.heap[c], e = c << 1; e <= a.heap_len && (e < a.heap_len && r(b, a.heap[e + 1], a.heap[e], a.depth) && e++, !r(b, d, a.heap[e], a.depth));) {
                a.heap[c] = a.heap[e], c = e, e <<= 1;
            }a.heap[c] = d;
        }
        function t(a, b, c) {
            var d,
                e,
                g,
                j,
                k = 0;
            if (0 !== a.last_lit) do {
                d = a.pending_buf[a.d_buf + 2 * k] << 8 | a.pending_buf[a.d_buf + 2 * k + 1], e = a.pending_buf[a.l_buf + k], k++, 0 === d ? i(a, e, b) : (g = ia[e], i(a, g + Q + 1, b), j = aa[g], 0 !== j && (e -= ja[g], h(a, e, j)), d--, g = f(d), i(a, g, c), j = ba[g], 0 !== j && (d -= ka[g], h(a, d, j)));
            } while (k < a.last_lit);i(a, Y, b);
        }
        function u(a, b) {
            var c,
                d,
                e,
                f = b.dyn_tree,
                g = b.stat_desc.static_tree,
                h = b.stat_desc.has_stree,
                i = b.stat_desc.elems,
                j = -1;
            for (a.heap_len = 0, a.heap_max = U, c = 0; c < i; c++) {
                0 !== f[2 * c] ? (a.heap[++a.heap_len] = j = c, a.depth[c] = 0) : f[2 * c + 1] = 0;
            }for (; a.heap_len < 2;) {
                e = a.heap[++a.heap_len] = j < 2 ? ++j : 0, f[2 * e] = 1, a.depth[e] = 0, a.opt_len--, h && (a.static_len -= g[2 * e + 1]);
            }for (b.max_code = j, c = a.heap_len >> 1; c >= 1; c--) {
                s(a, f, c);
            }e = i;
            do {
                c = a.heap[1], a.heap[1] = a.heap[a.heap_len--], s(a, f, 1), d = a.heap[1], a.heap[--a.heap_max] = c, a.heap[--a.heap_max] = d, f[2 * e] = f[2 * c] + f[2 * d], a.depth[e] = (a.depth[c] >= a.depth[d] ? a.depth[c] : a.depth[d]) + 1, f[2 * c + 1] = f[2 * d + 1] = e, a.heap[1] = e++, s(a, f, 1);
            } while (a.heap_len >= 2);a.heap[--a.heap_max] = a.heap[1], l(a, b), m(f, j, a.bl_count);
        }
        function v(a, b, c) {
            var d,
                e,
                f = -1,
                g = b[1],
                h = 0,
                i = 7,
                j = 4;
            for (0 === g && (i = 138, j = 3), b[2 * (c + 1) + 1] = 65535, d = 0; d <= c; d++) {
                e = g, g = b[2 * (d + 1) + 1], ++h < i && e === g || (h < j ? a.bl_tree[2 * e] += h : 0 !== e ? (e !== f && a.bl_tree[2 * e]++, a.bl_tree[2 * Z]++) : h <= 10 ? a.bl_tree[2 * $]++ : a.bl_tree[2 * _]++, h = 0, f = e, 0 === g ? (i = 138, j = 3) : e === g ? (i = 6, j = 3) : (i = 7, j = 4));
            }
        }
        function w(a, b, c) {
            var d,
                e,
                f = -1,
                g = b[1],
                j = 0,
                k = 7,
                l = 4;
            for (0 === g && (k = 138, l = 3), d = 0; d <= c; d++) {
                if (e = g, g = b[2 * (d + 1) + 1], !(++j < k && e === g)) {
                    if (j < l) {
                        do {
                            i(a, e, a.bl_tree);
                        } while (0 !== --j);
                    } else 0 !== e ? (e !== f && (i(a, e, a.bl_tree), j--), i(a, Z, a.bl_tree), h(a, j - 3, 2)) : j <= 10 ? (i(a, $, a.bl_tree), h(a, j - 3, 3)) : (i(a, _, a.bl_tree), h(a, j - 11, 7));
                    j = 0, f = e, 0 === g ? (k = 138, l = 3) : e === g ? (k = 6, l = 3) : (k = 7, l = 4);
                }
            }
        }
        function x(a) {
            var b;
            for (v(a, a.dyn_ltree, a.l_desc.max_code), v(a, a.dyn_dtree, a.d_desc.max_code), u(a, a.bl_desc), b = T - 1; b >= 3 && 0 === a.bl_tree[2 * da[b] + 1]; b--) {}
            return a.opt_len += 3 * (b + 1) + 5 + 5 + 4, b;
        }
        function y(a, b, c, d) {
            var e;
            for (h(a, b - 257, 5), h(a, c - 1, 5), h(a, d - 4, 4), e = 0; e < d; e++) {
                h(a, a.bl_tree[2 * da[e] + 1], 3);
            }w(a, a.dyn_ltree, b - 1), w(a, a.dyn_dtree, c - 1);
        }
        function z(a) {
            var b,
                c = 4093624447;
            for (b = 0; b <= 31; b++, c >>>= 1) {
                if (1 & c && 0 !== a.dyn_ltree[2 * b]) return H;
            }if (0 !== a.dyn_ltree[18] || 0 !== a.dyn_ltree[20] || 0 !== a.dyn_ltree[26]) return I;
            for (b = 32; b < Q; b++) {
                if (0 !== a.dyn_ltree[2 * b]) return I;
            }return H;
        }
        function A(a) {
            qa || (n(), qa = !0), a.l_desc = new pa(a.dyn_ltree, la), a.d_desc = new pa(a.dyn_dtree, ma), a.bl_desc = new pa(a.bl_tree, na), a.bi_buf = 0, a.bi_valid = 0, o(a);
        }
        function B(a, b, c, d) {
            h(a, (K << 1) + (d ? 1 : 0), 3), q(a, b, c, !0);
        }
        function C(a) {
            h(a, L << 1, 3), i(a, Y, fa), k(a);
        }
        function D(a, b, c, d) {
            var e,
                f,
                g = 0;
            a.level > 0 ? (a.strm.data_type === J && (a.strm.data_type = z(a)), u(a, a.l_desc), u(a, a.d_desc), g = x(a), e = a.opt_len + 3 + 7 >>> 3, f = a.static_len + 3 + 7 >>> 3, f <= e && (e = f)) : e = f = c + 5, c + 4 <= e && b !== -1 ? B(a, b, c, d) : a.strategy === G || f === e ? (h(a, (L << 1) + (d ? 1 : 0), 3), t(a, fa, ga)) : (h(a, (M << 1) + (d ? 1 : 0), 3), y(a, a.l_desc.max_code + 1, a.d_desc.max_code + 1, g + 1), t(a, a.dyn_ltree, a.dyn_dtree)), o(a), d && p(a);
        }
        function E(a, b, c) {
            return a.pending_buf[a.d_buf + 2 * a.last_lit] = b >>> 8 & 255, a.pending_buf[a.d_buf + 2 * a.last_lit + 1] = 255 & b, a.pending_buf[a.l_buf + a.last_lit] = 255 & c, a.last_lit++, 0 === b ? a.dyn_ltree[2 * c]++ : (a.matches++, b--, a.dyn_ltree[2 * (ia[c] + Q + 1)]++, a.dyn_dtree[2 * f(b)]++), a.last_lit === a.lit_bufsize - 1;
        }
        var F = a("3"),
            G = 4,
            H = 0,
            I = 1,
            J = 2,
            K = 0,
            L = 1,
            M = 2,
            N = 3,
            O = 258,
            P = 29,
            Q = 256,
            R = Q + 1 + P,
            S = 30,
            T = 19,
            U = 2 * R + 1,
            V = 15,
            W = 16,
            X = 7,
            Y = 256,
            Z = 16,
            $ = 17,
            _ = 18,
            aa = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
            ba = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
            ca = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
            da = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
            ea = 512,
            fa = new Array(2 * (R + 2));
        e(fa);
        var ga = new Array(2 * S);
        e(ga);
        var ha = new Array(ea);
        e(ha);
        var ia = new Array(O - N + 1);
        e(ia);
        var ja = new Array(P);
        e(ja);
        var ka = new Array(S);
        e(ka);
        var la,
            ma,
            na,
            oa = function oa(a, b, c, d, e) {
            this.static_tree = a, this.extra_bits = b, this.extra_base = c, this.elems = d, this.max_length = e, this.has_stree = a && a.length;
        },
            pa = function pa(a, b) {
            this.dyn_tree = a, this.max_code = 0, this.stat_desc = b;
        },
            qa = !1;
        c._tr_init = A, c._tr_stored_block = B, c._tr_flush_block = D, c._tr_tally = E, c._tr_align = C;
    },
    7: function _(a, b, c, d) {
        "use strict";

        function e(a, b, c, d) {
            for (var e = 65535 & a | 0, f = a >>> 16 & 65535 | 0, g = 0; 0 !== c;) {
                g = c > 2e3 ? 2e3 : c, c -= g;
                do {
                    e = e + b[d++] | 0, f = f + e | 0;
                } while (--g);e %= 65521, f %= 65521;
            }
            return e | f << 16 | 0;
        }
        b.exports = e;
    },
    8: function _(a, b, c, d) {
        "use strict";

        function e() {
            for (var a, b = [], c = 0; c < 256; c++) {
                a = c;
                for (var d = 0; d < 8; d++) {
                    a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
                }b[c] = a;
            }
            return b;
        }
        function f(a, b, c, d) {
            var e = g,
                f = d + c;
            a ^= -1;
            for (var h = d; h < f; h++) {
                a = a >>> 8 ^ e[255 & (a ^ b[h])];
            }return a ^ -1;
        }
        var g = e();
        b.exports = f;
    },
    9: function _(a, b, c, d) {
        "use strict";

        b.exports = {
            2: "need dictionary",
            1: "stream end",
            0: "",
            "-1": "file error",
            "-2": "stream error",
            "-3": "data error",
            "-4": "insufficient memory",
            "-5": "buffer error",
            "-6": "incompatible version"
        };
    },
    a: function a(_a, b, c, d) {
        "use strict";

        function e(a, b) {
            if (b < 65537 && (a.subarray && h || !a.subarray && g)) return String.fromCharCode.apply(null, f.shrinkBuf(a, b));
            for (var c = "", d = 0; d < b; d++) {
                c += String.fromCharCode(a[d]);
            }return c;
        }
        var f = _a("3"),
            g = !0,
            h = !0;
        try {
            String.fromCharCode.apply(null, [0]);
        } catch (i) {
            g = !1;
        }
        try {
            String.fromCharCode.apply(null, new Uint8Array(1));
        } catch (i) {
            h = !1;
        }
        for (var j = new f.Buf8(256), k = 0; k < 256; k++) {
            j[k] = k >= 252 ? 6 : k >= 248 ? 5 : k >= 240 ? 4 : k >= 224 ? 3 : k >= 192 ? 2 : 1;
        }j[254] = j[254] = 1, c.string2buf = function (a) {
            var b,
                c,
                d,
                e,
                g,
                h = a.length,
                i = 0;
            for (e = 0; e < h; e++) {
                c = a.charCodeAt(e), 55296 === (64512 & c) && e + 1 < h && (d = a.charCodeAt(e + 1), 56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320), e++)), i += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
            }for (b = new f.Buf8(i), g = 0, e = 0; g < i; e++) {
                c = a.charCodeAt(e), 55296 === (64512 & c) && e + 1 < h && (d = a.charCodeAt(e + 1), 56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320), e++)), c < 128 ? b[g++] = c : c < 2048 ? (b[g++] = 192 | c >>> 6, b[g++] = 128 | 63 & c) : c < 65536 ? (b[g++] = 224 | c >>> 12, b[g++] = 128 | c >>> 6 & 63, b[g++] = 128 | 63 & c) : (b[g++] = 240 | c >>> 18, b[g++] = 128 | c >>> 12 & 63, b[g++] = 128 | c >>> 6 & 63, b[g++] = 128 | 63 & c);
            }return b;
        }, c.buf2binstring = function (a) {
            return e(a, a.length);
        }, c.binstring2buf = function (a) {
            for (var b = new f.Buf8(a.length), c = 0, d = b.length; c < d; c++) {
                b[c] = a.charCodeAt(c);
            }return b;
        }, c.buf2string = function (a, b) {
            var c,
                d,
                f,
                g,
                h = b || a.length,
                i = new Array(2 * h);
            for (d = 0, c = 0; c < h;) {
                if (f = a[c++], f < 128) i[d++] = f;else if (g = j[f], g > 4) i[d++] = 65533, c += g - 1;else {
                    for (f &= 2 === g ? 31 : 3 === g ? 15 : 7; g > 1 && c < h;) {
                        f = f << 6 | 63 & a[c++], g--;
                    }g > 1 ? i[d++] = 65533 : f < 65536 ? i[d++] = f : (f -= 65536, i[d++] = 55296 | f >> 10 & 1023, i[d++] = 56320 | 1023 & f);
                }
            }return e(i, d);
        }, c.utf8border = function (a, b) {
            var c;
            for (b = b || a.length, b > a.length && (b = a.length), c = b - 1; c >= 0 && 128 === (192 & a[c]);) {
                c--;
            }return c < 0 ? b : 0 === c ? b : c + j[a[c]] > b ? c : b;
        };
    },
    b: function b(a, _b, c, d) {
        "use strict";

        function e() {
            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        }
        _b.exports = e;
    },
    c: function c(a, b, _c, d) {
        "use strict";

        function e(a, b) {
            var c = new n(b);
            if (c.push(a, !0), c.err) throw c.msg;
            return c.result;
        }
        function f(a, b) {
            return b = b || {}, b.raw = !0, e(a, b);
        }
        var g = a("d"),
            h = a("3"),
            i = a("a"),
            j = a("g"),
            k = a("9"),
            l = a("b"),
            m = a("h"),
            n = function n(a) {
            this.options = h.assign({
                chunkSize: 16384,
                windowBits: 0,
                to: ""
            }, a || {});
            var b = this.options;
            b.raw && b.windowBits >= 0 && b.windowBits < 16 && (b.windowBits = -b.windowBits, 0 === b.windowBits && (b.windowBits = -15)), !(b.windowBits >= 0 && b.windowBits < 16) || a && a.windowBits || (b.windowBits += 32), b.windowBits > 15 && b.windowBits < 48 && 0 === (15 & b.windowBits) && (b.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new l(), this.strm.avail_out = 0;
            var c = g.inflateInit2(this.strm, b.windowBits);
            if (c !== j.Z_OK) throw new Error(k[c]);
            this.header = new m(), g.inflateGetHeader(this.strm, this.header);
        };
        n.prototype.push = function (a, b) {
            var c,
                d,
                e,
                f,
                k,
                l = this.strm,
                m = this.options.chunkSize;
            if (this.ended) return !1;
            d = b === ~~b ? b : b === !0 ? j.Z_FINISH : j.Z_NO_FLUSH, "string" == typeof a ? l.input = i.binstring2buf(a) : l.input = a, l.next_in = 0, l.avail_in = l.input.length;
            do {
                if (0 === l.avail_out && (l.output = new h.Buf8(m), l.next_out = 0, l.avail_out = m), c = g.inflate(l, j.Z_NO_FLUSH), c !== j.Z_STREAM_END && c !== j.Z_OK) return this.onEnd(c), this.ended = !0, !1;
                l.next_out && (0 === l.avail_out || c === j.Z_STREAM_END || 0 === l.avail_in && d === j.Z_FINISH) && ("string" === this.options.to ? (e = i.utf8border(l.output, l.next_out), f = l.next_out - e, k = i.buf2string(l.output, e), l.next_out = f, l.avail_out = m - f, f && h.arraySet(l.output, l.output, e, f, 0), this.onData(k)) : this.onData(h.shrinkBuf(l.output, l.next_out)));
            } while (l.avail_in > 0 && c !== j.Z_STREAM_END);return c === j.Z_STREAM_END && (d = j.Z_FINISH), d !== j.Z_FINISH || (c = g.inflateEnd(this.strm), this.onEnd(c), this.ended = !0, c === j.Z_OK);
        }, n.prototype.onData = function (a) {
            this.chunks.push(a);
        }, n.prototype.onEnd = function (a) {
            a === j.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = h.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
        }, _c.Inflate = n, _c.inflate = e, _c.inflateRaw = f, _c.ungzip = e;
    },
    d: function d(a, b, c, _d) {
        "use strict";

        function e(a) {
            return (a >>> 24 & 255) + (a >>> 8 & 65280) + ((65280 & a) << 8) + ((255 & a) << 24);
        }
        function f() {
            this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function g(a) {
            var b;
            return a && a.state ? (b = a.state, a.total_in = a.total_out = b.total = 0, a.msg = "", b.wrap && (a.adler = 1 & b.wrap), b.mode = L, b.last = 0, b.havedict = 0, b.dmax = 32768, b.head = null, b.hold = 0, b.bits = 0, b.lencode = b.lendyn = new s.Buf32(pa), b.distcode = b.distdyn = new s.Buf32(qa), b.sane = 1, b.back = -1, D) : G;
        }
        function h(a) {
            var b;
            return a && a.state ? (b = a.state, b.wsize = 0, b.whave = 0, b.wnext = 0, g(a)) : G;
        }
        function i(a, b) {
            var c, d;
            return a && a.state ? (d = a.state, b < 0 ? (c = 0, b = -b) : (c = (b >> 4) + 1, b < 48 && (b &= 15)), b && (b < 8 || b > 15) ? G : (null !== d.window && d.wbits !== b && (d.window = null), d.wrap = c, d.wbits = b, h(a))) : G;
        }
        function j(a, b) {
            var c, d;
            return a ? (d = new f(), a.state = d, d.window = null, c = i(a, b), c !== D && (a.state = null), c) : G;
        }
        function k(a) {
            return j(a, sa);
        }
        function l(a) {
            if (ta) {
                var b;
                for (q = new s.Buf32(512), r = new s.Buf32(32), b = 0; b < 144;) {
                    a.lens[b++] = 8;
                }for (; b < 256;) {
                    a.lens[b++] = 9;
                }for (; b < 280;) {
                    a.lens[b++] = 7;
                }for (; b < 288;) {
                    a.lens[b++] = 8;
                }for (w(y, a.lens, 0, 288, q, 0, a.work, {
                    bits: 9
                }), b = 0; b < 32;) {
                    a.lens[b++] = 5;
                }w(z, a.lens, 0, 32, r, 0, a.work, {
                    bits: 5
                }), ta = !1;
            }
            a.lencode = q, a.lenbits = 9, a.distcode = r, a.distbits = 5;
        }
        function m(a, b, c, d) {
            var e,
                f = a.state;
            return null === f.window && (f.wsize = 1 << f.wbits, f.wnext = 0, f.whave = 0, f.window = new s.Buf8(f.wsize)), d >= f.wsize ? (s.arraySet(f.window, b, c - f.wsize, f.wsize, 0), f.wnext = 0, f.whave = f.wsize) : (e = f.wsize - f.wnext, e > d && (e = d), s.arraySet(f.window, b, c - d, e, f.wnext), d -= e, d ? (s.arraySet(f.window, b, c - d, d, 0), f.wnext = d, f.whave = f.wsize) : (f.wnext += e, f.wnext === f.wsize && (f.wnext = 0), f.whave < f.wsize && (f.whave += e))), 0;
        }
        function n(a, b) {
            var c,
                d,
                f,
                g,
                h,
                i,
                j,
                k,
                n,
                o,
                p,
                q,
                r,
                pa,
                qa,
                ra,
                sa,
                ta,
                ua,
                va,
                wa,
                xa,
                ya,
                za,
                Aa = 0,
                Ba = new s.Buf8(4),
                Ca = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
            if (!a || !a.state || !a.output || !a.input && 0 !== a.avail_in) return G;
            c = a.state, c.mode === W && (c.mode = X), h = a.next_out, f = a.output, j = a.avail_out, g = a.next_in, d = a.input, i = a.avail_in, k = c.hold, n = c.bits, o = i, p = j, xa = D;
            a: for (;;) {
                switch (c.mode) {
                    case L:
                        if (0 === c.wrap) {
                            c.mode = X;
                            break;
                        }
                        for (; n < 16;) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        if (2 & c.wrap && 35615 === k) {
                            c.check = 0, Ba[0] = 255 & k, Ba[1] = k >>> 8 & 255, c.check = u(c.check, Ba, 2, 0), k = 0, n = 0, c.mode = M;
                            break;
                        }
                        if (c.flags = 0, c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & k) << 8) + (k >> 8)) % 31) {
                            a.msg = "incorrect header check", c.mode = ma;
                            break;
                        }
                        if ((15 & k) !== K) {
                            a.msg = "unknown compression method", c.mode = ma;
                            break;
                        }
                        if (k >>>= 4, n -= 4, wa = (15 & k) + 8, 0 === c.wbits) c.wbits = wa;else if (wa > c.wbits) {
                            a.msg = "invalid window size", c.mode = ma;
                            break;
                        }
                        c.dmax = 1 << wa, a.adler = c.check = 1, c.mode = 512 & k ? U : W, k = 0, n = 0;
                        break;
                    case M:
                        for (; n < 16;) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        if (c.flags = k, (255 & c.flags) !== K) {
                            a.msg = "unknown compression method", c.mode = ma;
                            break;
                        }
                        if (57344 & c.flags) {
                            a.msg = "unknown header flags set", c.mode = ma;
                            break;
                        }
                        c.head && (c.head.text = k >> 8 & 1), 512 & c.flags && (Ba[0] = 255 & k, Ba[1] = k >>> 8 & 255, c.check = u(c.check, Ba, 2, 0)), k = 0, n = 0, c.mode = N;
                    case N:
                        for (; n < 32;) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        c.head && (c.head.time = k), 512 & c.flags && (Ba[0] = 255 & k, Ba[1] = k >>> 8 & 255, Ba[2] = k >>> 16 & 255, Ba[3] = k >>> 24 & 255, c.check = u(c.check, Ba, 4, 0)), k = 0, n = 0, c.mode = O;
                    case O:
                        for (; n < 16;) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        c.head && (c.head.xflags = 255 & k, c.head.os = k >> 8), 512 & c.flags && (Ba[0] = 255 & k, Ba[1] = k >>> 8 & 255, c.check = u(c.check, Ba, 2, 0)), k = 0, n = 0, c.mode = P;
                    case P:
                        if (1024 & c.flags) {
                            for (; n < 16;) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            c.length = k, c.head && (c.head.extra_len = k), 512 & c.flags && (Ba[0] = 255 & k, Ba[1] = k >>> 8 & 255, c.check = u(c.check, Ba, 2, 0)), k = 0, n = 0;
                        } else c.head && (c.head.extra = null);
                        c.mode = Q;
                    case Q:
                        if (1024 & c.flags && (q = c.length, q > i && (q = i), q && (c.head && (wa = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), s.arraySet(c.head.extra, d, g, q, wa)), 512 & c.flags && (c.check = u(c.check, d, q, g)), i -= q, g += q, c.length -= q), c.length)) break a;
                        c.length = 0, c.mode = R;
                    case R:
                        if (2048 & c.flags) {
                            if (0 === i) break a;
                            q = 0;
                            do {
                                wa = d[g + q++], c.head && wa && c.length < 65536 && (c.head.name += String.fromCharCode(wa));
                            } while (wa && q < i);if (512 & c.flags && (c.check = u(c.check, d, q, g)), i -= q, g += q, wa) break a;
                        } else c.head && (c.head.name = null);
                        c.length = 0, c.mode = S;
                    case S:
                        if (4096 & c.flags) {
                            if (0 === i) break a;
                            q = 0;
                            do {
                                wa = d[g + q++], c.head && wa && c.length < 65536 && (c.head.comment += String.fromCharCode(wa));
                            } while (wa && q < i);if (512 & c.flags && (c.check = u(c.check, d, q, g)), i -= q, g += q, wa) break a;
                        } else c.head && (c.head.comment = null);
                        c.mode = T;
                    case T:
                        if (512 & c.flags) {
                            for (; n < 16;) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            if (k !== (65535 & c.check)) {
                                a.msg = "header crc mismatch", c.mode = ma;
                                break;
                            }
                            k = 0, n = 0;
                        }
                        c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), a.adler = c.check = 0, c.mode = W;
                        break;
                    case U:
                        for (; n < 32;) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        a.adler = c.check = e(k), k = 0, n = 0, c.mode = V;
                    case V:
                        if (0 === c.havedict) return a.next_out = h, a.avail_out = j, a.next_in = g, a.avail_in = i, c.hold = k, c.bits = n, F;
                        a.adler = c.check = 1, c.mode = W;
                    case W:
                        if (b === B || b === C) break a;
                    case X:
                        if (c.last) {
                            k >>>= 7 & n, n -= 7 & n, c.mode = ja;
                            break;
                        }
                        for (; n < 3;) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        switch (c.last = 1 & k, k >>>= 1, n -= 1, 3 & k) {
                            case 0:
                                c.mode = Y;
                                break;
                            case 1:
                                if (l(c), c.mode = ca, b === C) {
                                    k >>>= 2, n -= 2;
                                    break a;
                                }
                                break;
                            case 2:
                                c.mode = _;
                                break;
                            case 3:
                                a.msg = "invalid block type", c.mode = ma;
                        }
                        k >>>= 2, n -= 2;
                        break;
                    case Y:
                        for (k >>>= 7 & n, n -= 7 & n; n < 32;) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        if ((65535 & k) !== (k >>> 16 ^ 65535)) {
                            a.msg = "invalid stored block lengths", c.mode = ma;
                            break;
                        }
                        if (c.length = 65535 & k, k = 0, n = 0, c.mode = Z, b === C) break a;
                    case Z:
                        c.mode = $;
                    case $:
                        if (q = c.length) {
                            if (q > i && (q = i), q > j && (q = j), 0 === q) break a;
                            s.arraySet(f, d, g, q, h), i -= q, g += q, j -= q, h += q, c.length -= q;
                            break;
                        }
                        c.mode = W;
                        break;
                    case _:
                        for (; n < 14;) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        if (c.nlen = (31 & k) + 257, k >>>= 5, n -= 5, c.ndist = (31 & k) + 1, k >>>= 5, n -= 5, c.ncode = (15 & k) + 4, k >>>= 4, n -= 4, c.nlen > 286 || c.ndist > 30) {
                            a.msg = "too many length or distance symbols", c.mode = ma;
                            break;
                        }
                        c.have = 0, c.mode = aa;
                    case aa:
                        for (; c.have < c.ncode;) {
                            for (; n < 3;) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            c.lens[Ca[c.have++]] = 7 & k, k >>>= 3, n -= 3;
                        }
                        for (; c.have < 19;) {
                            c.lens[Ca[c.have++]] = 0;
                        }if (c.lencode = c.lendyn, c.lenbits = 7, ya = {
                            bits: c.lenbits
                        }, xa = w(x, c.lens, 0, 19, c.lencode, 0, c.work, ya), c.lenbits = ya.bits, xa) {
                            a.msg = "invalid code lengths set", c.mode = ma;
                            break;
                        }
                        c.have = 0, c.mode = ba;
                    case ba:
                        for (; c.have < c.nlen + c.ndist;) {
                            for (; Aa = c.lencode[k & (1 << c.lenbits) - 1], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(qa <= n);) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            if (sa < 16) k >>>= qa, n -= qa, c.lens[c.have++] = sa;else {
                                if (16 === sa) {
                                    for (za = qa + 2; n < za;) {
                                        if (0 === i) break a;
                                        i--, k += d[g++] << n, n += 8;
                                    }
                                    if (k >>>= qa, n -= qa, 0 === c.have) {
                                        a.msg = "invalid bit length repeat", c.mode = ma;
                                        break;
                                    }
                                    wa = c.lens[c.have - 1], q = 3 + (3 & k), k >>>= 2, n -= 2;
                                } else if (17 === sa) {
                                    for (za = qa + 3; n < za;) {
                                        if (0 === i) break a;
                                        i--, k += d[g++] << n, n += 8;
                                    }
                                    k >>>= qa, n -= qa, wa = 0, q = 3 + (7 & k), k >>>= 3, n -= 3;
                                } else {
                                    for (za = qa + 7; n < za;) {
                                        if (0 === i) break a;
                                        i--, k += d[g++] << n, n += 8;
                                    }
                                    k >>>= qa, n -= qa, wa = 0, q = 11 + (127 & k), k >>>= 7, n -= 7;
                                }
                                if (c.have + q > c.nlen + c.ndist) {
                                    a.msg = "invalid bit length repeat", c.mode = ma;
                                    break;
                                }
                                for (; q--;) {
                                    c.lens[c.have++] = wa;
                                }
                            }
                        }
                        if (c.mode === ma) break;
                        if (0 === c.lens[256]) {
                            a.msg = "invalid code -- missing end-of-block", c.mode = ma;
                            break;
                        }
                        if (c.lenbits = 9, ya = {
                            bits: c.lenbits
                        }, xa = w(y, c.lens, 0, c.nlen, c.lencode, 0, c.work, ya), c.lenbits = ya.bits, xa) {
                            a.msg = "invalid literal/lengths set", c.mode = ma;
                            break;
                        }
                        if (c.distbits = 6, c.distcode = c.distdyn, ya = {
                            bits: c.distbits
                        }, xa = w(z, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, ya), c.distbits = ya.bits, xa) {
                            a.msg = "invalid distances set", c.mode = ma;
                            break;
                        }
                        if (c.mode = ca, b === C) break a;
                    case ca:
                        c.mode = da;
                    case da:
                        if (i >= 6 && j >= 258) {
                            a.next_out = h, a.avail_out = j, a.next_in = g, a.avail_in = i, c.hold = k, c.bits = n, v(a, p), h = a.next_out, f = a.output, j = a.avail_out, g = a.next_in, d = a.input, i = a.avail_in, k = c.hold, n = c.bits, c.mode === W && (c.back = -1);
                            break;
                        }
                        for (c.back = 0; Aa = c.lencode[k & (1 << c.lenbits) - 1], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(qa <= n);) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        if (ra && 0 === (240 & ra)) {
                            for (ta = qa, ua = ra, va = sa; Aa = c.lencode[va + ((k & (1 << ta + ua) - 1) >> ta)], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(ta + qa <= n);) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            k >>>= ta, n -= ta, c.back += ta;
                        }
                        if (k >>>= qa, n -= qa, c.back += qa, c.length = sa, 0 === ra) {
                            c.mode = ia;
                            break;
                        }
                        if (32 & ra) {
                            c.back = -1, c.mode = W;
                            break;
                        }
                        if (64 & ra) {
                            a.msg = "invalid literal/length code", c.mode = ma;
                            break;
                        }
                        c.extra = 15 & ra, c.mode = ea;
                    case ea:
                        if (c.extra) {
                            for (za = c.extra; n < za;) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            c.length += k & (1 << c.extra) - 1, k >>>= c.extra, n -= c.extra, c.back += c.extra;
                        }
                        c.was = c.length, c.mode = fa;
                    case fa:
                        for (; Aa = c.distcode[k & (1 << c.distbits) - 1], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(qa <= n);) {
                            if (0 === i) break a;
                            i--, k += d[g++] << n, n += 8;
                        }
                        if (0 === (240 & ra)) {
                            for (ta = qa, ua = ra, va = sa; Aa = c.distcode[va + ((k & (1 << ta + ua) - 1) >> ta)], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(ta + qa <= n);) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            k >>>= ta, n -= ta, c.back += ta;
                        }
                        if (k >>>= qa, n -= qa, c.back += qa, 64 & ra) {
                            a.msg = "invalid distance code", c.mode = ma;
                            break;
                        }
                        c.offset = sa, c.extra = 15 & ra, c.mode = ga;
                    case ga:
                        if (c.extra) {
                            for (za = c.extra; n < za;) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            c.offset += k & (1 << c.extra) - 1, k >>>= c.extra, n -= c.extra, c.back += c.extra;
                        }
                        if (c.offset > c.dmax) {
                            a.msg = "invalid distance too far back", c.mode = ma;
                            break;
                        }
                        c.mode = ha;
                    case ha:
                        if (0 === j) break a;
                        if (q = p - j, c.offset > q) {
                            if (q = c.offset - q, q > c.whave && c.sane) {
                                a.msg = "invalid distance too far back", c.mode = ma;
                                break;
                            }
                            q > c.wnext ? (q -= c.wnext, r = c.wsize - q) : r = c.wnext - q, q > c.length && (q = c.length), pa = c.window;
                        } else pa = f, r = h - c.offset, q = c.length;
                        q > j && (q = j), j -= q, c.length -= q;
                        do {
                            f[h++] = pa[r++];
                        } while (--q);0 === c.length && (c.mode = da);
                        break;
                    case ia:
                        if (0 === j) break a;
                        f[h++] = c.length, j--, c.mode = da;
                        break;
                    case ja:
                        if (c.wrap) {
                            for (; n < 32;) {
                                if (0 === i) break a;
                                i--, k |= d[g++] << n, n += 8;
                            }
                            if (p -= j, a.total_out += p, c.total += p, p && (a.adler = c.check = c.flags ? u(c.check, f, p, h - p) : t(c.check, f, p, h - p)), p = j, (c.flags ? k : e(k)) !== c.check) {
                                a.msg = "incorrect data check", c.mode = ma;
                                break;
                            }
                            k = 0, n = 0;
                        }
                        c.mode = ka;
                    case ka:
                        if (c.wrap && c.flags) {
                            for (; n < 32;) {
                                if (0 === i) break a;
                                i--, k += d[g++] << n, n += 8;
                            }
                            if (k !== (4294967295 & c.total)) {
                                a.msg = "incorrect length check", c.mode = ma;
                                break;
                            }
                            k = 0, n = 0;
                        }
                        c.mode = la;
                    case la:
                        xa = E;
                        break a;
                    case ma:
                        xa = H;
                        break a;
                    case na:
                        return I;
                    case oa:
                    default:
                        return G;
                }
            }return a.next_out = h, a.avail_out = j, a.next_in = g, a.avail_in = i, c.hold = k, c.bits = n, (c.wsize || p !== a.avail_out && c.mode < ma && (c.mode < ja || b !== A)) && m(a, a.output, a.next_out, p - a.avail_out) ? (c.mode = na, I) : (o -= a.avail_in, p -= a.avail_out, a.total_in += o, a.total_out += p, c.total += p, c.wrap && p && (a.adler = c.check = c.flags ? u(c.check, f, p, a.next_out - p) : t(c.check, f, p, a.next_out - p)), a.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === W ? 128 : 0) + (c.mode === ca || c.mode === Z ? 256 : 0), (0 === o && 0 === p || b === A) && xa === D && (xa = J), xa);
        }
        function o(a) {
            if (!a || !a.state) return G;
            var b = a.state;
            return b.window && (b.window = null), a.state = null, D;
        }
        function p(a, b) {
            var c;
            return a && a.state ? (c = a.state, 0 === (2 & c.wrap) ? G : (c.head = b, b.done = !1, D)) : G;
        }
        var q,
            r,
            s = a("3"),
            t = a("7"),
            u = a("8"),
            v = a("e"),
            w = a("f"),
            x = 0,
            y = 1,
            z = 2,
            A = 4,
            B = 5,
            C = 6,
            D = 0,
            E = 1,
            F = 2,
            G = -2,
            H = -3,
            I = -4,
            J = -5,
            K = 8,
            L = 1,
            M = 2,
            N = 3,
            O = 4,
            P = 5,
            Q = 6,
            R = 7,
            S = 8,
            T = 9,
            U = 10,
            V = 11,
            W = 12,
            X = 13,
            Y = 14,
            Z = 15,
            $ = 16,
            _ = 17,
            aa = 18,
            ba = 19,
            ca = 20,
            da = 21,
            ea = 22,
            fa = 23,
            ga = 24,
            ha = 25,
            ia = 26,
            ja = 27,
            ka = 28,
            la = 29,
            ma = 30,
            na = 31,
            oa = 32,
            pa = 852,
            qa = 592,
            ra = 15,
            sa = ra,
            ta = !0;
        c.inflateReset = h, c.inflateReset2 = i, c.inflateResetKeep = g, c.inflateInit = k, c.inflateInit2 = j, c.inflate = n, c.inflateEnd = o, c.inflateGetHeader = p, c.inflateInfo = "pako inflate (from Nodeca project)";
    },
    e: function e(a, b, c, d) {
        "use strict";

        var e = 30,
            f = 12;
        b.exports = function (a, b) {
            var c, d, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C;
            c = a.state, d = a.next_in, B = a.input, g = d + (a.avail_in - 5), h = a.next_out, C = a.output, i = h - (b - a.avail_out), j = h + (a.avail_out - 257), k = c.dmax, l = c.wsize, m = c.whave, n = c.wnext, o = c.window, p = c.hold, q = c.bits, r = c.lencode, s = c.distcode, t = (1 << c.lenbits) - 1, u = (1 << c.distbits) - 1;
            a: do {
                q < 15 && (p += B[d++] << q, q += 8, p += B[d++] << q, q += 8), v = r[p & t];
                b: for (;;) {
                    if (w = v >>> 24, p >>>= w, q -= w, w = v >>> 16 & 255, 0 === w) C[h++] = 65535 & v;else {
                        if (!(16 & w)) {
                            if (0 === (64 & w)) {
                                v = r[(65535 & v) + (p & (1 << w) - 1)];
                                continue b;
                            }
                            if (32 & w) {
                                c.mode = f;
                                break a;
                            }
                            a.msg = "invalid literal/length code", c.mode = e;
                            break a;
                        }
                        x = 65535 & v, w &= 15, w && (q < w && (p += B[d++] << q, q += 8), x += p & (1 << w) - 1, p >>>= w, q -= w), q < 15 && (p += B[d++] << q, q += 8, p += B[d++] << q, q += 8), v = s[p & u];
                        c: for (;;) {
                            if (w = v >>> 24, p >>>= w, q -= w, w = v >>> 16 & 255, !(16 & w)) {
                                if (0 === (64 & w)) {
                                    v = s[(65535 & v) + (p & (1 << w) - 1)];
                                    continue c;
                                }
                                a.msg = "invalid distance code", c.mode = e;
                                break a;
                            }
                            if (y = 65535 & v, w &= 15, q < w && (p += B[d++] << q, q += 8, q < w && (p += B[d++] << q, q += 8)), y += p & (1 << w) - 1, y > k) {
                                a.msg = "invalid distance too far back", c.mode = e;
                                break a;
                            }
                            if (p >>>= w, q -= w, w = h - i, y > w) {
                                if (w = y - w, w > m && c.sane) {
                                    a.msg = "invalid distance too far back", c.mode = e;
                                    break a;
                                }
                                if (z = 0, A = o, 0 === n) {
                                    if (z += l - w, w < x) {
                                        x -= w;
                                        do {
                                            C[h++] = o[z++];
                                        } while (--w);z = h - y, A = C;
                                    }
                                } else if (n < w) {
                                    if (z += l + n - w, w -= n, w < x) {
                                        x -= w;
                                        do {
                                            C[h++] = o[z++];
                                        } while (--w);if (z = 0, n < x) {
                                            w = n, x -= w;
                                            do {
                                                C[h++] = o[z++];
                                            } while (--w);z = h - y, A = C;
                                        }
                                    }
                                } else if (z += n - w, w < x) {
                                    x -= w;
                                    do {
                                        C[h++] = o[z++];
                                    } while (--w);z = h - y, A = C;
                                }
                                for (; x > 2;) {
                                    C[h++] = A[z++], C[h++] = A[z++], C[h++] = A[z++], x -= 3;
                                }x && (C[h++] = A[z++], x > 1 && (C[h++] = A[z++]));
                            } else {
                                z = h - y;
                                do {
                                    C[h++] = C[z++], C[h++] = C[z++], C[h++] = C[z++], x -= 3;
                                } while (x > 2);x && (C[h++] = C[z++], x > 1 && (C[h++] = C[z++]));
                            }
                            break;
                        }
                    }
                    break;
                }
            } while (d < g && h < j);x = q >> 3, d -= x, q -= x << 3, p &= (1 << q) - 1, a.next_in = d, a.next_out = h, a.avail_in = d < g ? 5 + (g - d) : 5 - (d - g), a.avail_out = h < j ? 257 + (j - h) : 257 - (h - j), c.hold = p, c.bits = q;
        };
    },
    f: function f(a, b, c, d) {
        "use strict";

        var e = a("3"),
            f = 15,
            g = 852,
            h = 592,
            i = 0,
            j = 1,
            k = 2,
            l = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
            m = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
            n = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
            o = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        b.exports = function (a, b, c, d, p, q, r, s) {
            var t,
                u,
                v,
                w,
                x,
                y,
                z,
                A,
                B,
                C = s.bits,
                D = 0,
                E = 0,
                F = 0,
                G = 0,
                H = 0,
                I = 0,
                J = 0,
                K = 0,
                L = 0,
                M = 0,
                N = null,
                O = 0,
                P = new e.Buf16(f + 1),
                Q = new e.Buf16(f + 1),
                R = null,
                S = 0;
            for (D = 0; D <= f; D++) {
                P[D] = 0;
            }for (E = 0; E < d; E++) {
                P[b[c + E]]++;
            }for (H = C, G = f; G >= 1 && 0 === P[G]; G--) {}
            if (H > G && (H = G), 0 === G) return p[q++] = 20971520, p[q++] = 20971520, s.bits = 1, 0;
            for (F = 1; F < G && 0 === P[F]; F++) {}
            for (H < F && (H = F), K = 1, D = 1; D <= f; D++) {
                if (K <<= 1, K -= P[D], K < 0) return -1;
            }if (K > 0 && (a === i || 1 !== G)) return -1;
            for (Q[1] = 0, D = 1; D < f; D++) {
                Q[D + 1] = Q[D] + P[D];
            }for (E = 0; E < d; E++) {
                0 !== b[c + E] && (r[Q[b[c + E]]++] = E);
            }if (a === i ? (N = R = r, y = 19) : a === j ? (N = l, O -= 257, R = m, S -= 257, y = 256) : (N = n, R = o, y = -1), M = 0, E = 0, D = F, x = q, I = H, J = 0, v = -1, L = 1 << H, w = L - 1, a === j && L > g || a === k && L > h) return 1;
            for (var T = 0;;) {
                T++, z = D - J, r[E] < y ? (A = 0, B = r[E]) : r[E] > y ? (A = R[S + r[E]], B = N[O + r[E]]) : (A = 96, B = 0), t = 1 << D - J, u = 1 << I, F = u;
                do {
                    u -= t, p[x + (M >> J) + u] = z << 24 | A << 16 | B | 0;
                } while (0 !== u);for (t = 1 << D - 1; M & t;) {
                    t >>= 1;
                }if (0 !== t ? (M &= t - 1, M += t) : M = 0, E++, 0 === --P[D]) {
                    if (D === G) break;
                    D = b[c + r[E]];
                }
                if (D > H && (M & w) !== v) {
                    for (0 === J && (J = H), x += F, I = D - J, K = 1 << I; I + J < G && (K -= P[I + J], !(K <= 0));) {
                        I++, K <<= 1;
                    }if (L += 1 << I, a === j && L > g || a === k && L > h) return 1;
                    v = M & w, p[v] = H << 24 | I << 16 | x - q | 0;
                }
            }
            return 0 !== M && (p[x + M] = D - J << 24 | 64 << 16 | 0), s.bits = H, 0;
        };
    },
    g: function g(a, b, c, d) {
        b.exports = {
            Z_NO_FLUSH: 0,
            Z_PARTIAL_FLUSH: 1,
            Z_SYNC_FLUSH: 2,
            Z_FULL_FLUSH: 3,
            Z_FINISH: 4,
            Z_BLOCK: 5,
            Z_TREES: 6,
            Z_OK: 0,
            Z_STREAM_END: 1,
            Z_NEED_DICT: 2,
            Z_ERRNO: -1,
            Z_STREAM_ERROR: -2,
            Z_DATA_ERROR: -3,
            Z_BUF_ERROR: -5,
            Z_NO_COMPRESSION: 0,
            Z_BEST_SPEED: 1,
            Z_BEST_COMPRESSION: 9,
            Z_DEFAULT_COMPRESSION: -1,
            Z_FILTERED: 1,
            Z_HUFFMAN_ONLY: 2,
            Z_RLE: 3,
            Z_FIXED: 4,
            Z_DEFAULT_STRATEGY: 0,
            Z_BINARY: 0,
            Z_TEXT: 1,
            Z_UNKNOWN: 2,
            Z_DEFLATED: 8
        };
    },
    h: function h(a, b, c, d) {
        "use strict";

        function e() {
            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        }
        b.exports = e;
    }
});

exports.default = PNGReader;