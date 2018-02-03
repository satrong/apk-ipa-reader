// 导出方法：
// BinaryXmlParser
// ManifestParser
// ApkManifestReader
// parseApkinit
// getUdids
// getXMLPlist
// getPlist
// PNGConvertor
// PNGReader

import PNGConvertor from './PNGConvertor.js';
import PNGReader from './PNGReader.js';

let a = window;
let package_id;

function b(b, c) {
    function d(a) {
        var b = a.match(j)
            , c = new Date(0)
            , d = 0;
        if (null != b[1] && c.setUTCFullYear(parseInt(b[1])),
            null != b[2] && c.setUTCMonth(parseInt(b[2]) - 1),
            null != b[3] && c.setUTCDate(parseInt(b[3])),
            null != b[4] && c.setUTCHours(parseInt(b[4])),
            null != b[5] && c.setUTCMinutes(parseInt(b[5])),
            null != b[6] && c.setUTCSeconds(parseInt(b[6])),
            null != b[7] && null != b[8] && null != b[9]) {
            var e = ("-" == b[7] ? -1 : 1,
                parseInt(b[8]))
                , f = parseInt(b[9]);
            d = 60 * (60 * e + f) * 1e3
        }
        return new Date(Number(c) + d)
    }
    function e(a) {
        for (var b = {}, c = 0; c < a.length; c += 2) {
            var d = a[c]
                , e = a[c + 1];
            "key" == d.nodeName && (b[d.textContent] = h(e))
        }
        return b
    }
    function f(a) {
        for (var b = [], c = 0; c < a.length; c++)
            b[c] = h(a[c]);
        return b
    }
    function g(a) {
        for (var b = a.childNodes, c = [], d = 0; d < b.length; d++) {
            var e = b[d];
            "#text" != e.nodeName && c.push(e)
        }
        return c
    }
    function h(a) {
        switch (a.nodeName) {
            case "dict":
                return e(g(a));
            case "array":
                return f(g(a));
            case "string":
                return a.textContent;
            case "number":
                return parseFloat(a.textContent);
            case "real":
                return parseFloat(a.textContent);
            case "integer":
                return parseInt(a.textContent);
            case "date":
                return d(a.textContent);
            case "true":
                return !0;
            case "false":
                return !1
        }
    }
    function i(b) {
        var c;
        if (a.ActiveXObject)
            c = new ActiveXObject("Microsoft.XMLDOM"),
                c.async = "false",
                c.load(b);
        else {
            var d = new DOMParser;
            c = d.parseFromString(b, "text/xml")
        }
        var e = c.documentElement;
        e = g(e)[0];
        var f = h(e);
        return f
    }
    var j = /(\d\d\d\d)-(\d\d)-(\d\d)(?:T|\s+)(\d\d):(\d\d):(\d\d)\s*(?:Z|([-+])([0-9]{2}):?([0-9]{2}))?/;
    if ("string" == typeof b)
        c(i(b));
    else {
        var k = new FileReader;
        k.onload = function (a) {
            c(i(k.result))
        }
            ,
            k.readAsText(b)
    }
}
function c(a, c) {
    function d(a, b) {
        void 0 == a && (a = 0),
            void 0 == b && (b = l.length);
        for (var c = "", d = 0; d < b; d++) {
            var e = l[a + d].toString(16).toUpperCase();
            1 == e.length && (e = "0" + e),
                c += e
        }
        return c
    }
    function e(a, b, c) {
        void 0 == a && (a = 0),
            void 0 == b && (b = l.length);
        for (var d = "", e = 0; e < b; e++)
            d += c ? String.fromCharCode(f(a + 2 * e, 2)) : String.fromCharCode(l[a + e]);
        return d
    }
    function f(a, b) {
        void 0 == a && (a = 0),
            void 0 == b && (b = l.length);
        for (var c = 0, d = 0; d < b; d++) {
            var e = l[a + d] << 8 * (b - 1 - d);
            c += e
        }
        return c
    }
    function h(a, b) {
        var c, e;
        if (b < 4) {
            e = d(a, b);
            for (var f = 0; f < 4 - b; f++)
                e = "00" + e;
            b = 4
        } else
            e = d(a, 4);
        c = parseInt("0x" + e);
        var g = (c >> 20 & 2047) - 1023
            , h = 1 * (1048575 & c | 1048576) / Math.pow(2, 20) * Math.pow(2, g);
        if (4 == b)
            return h;
        if (8 == b) {
            var i = parseInt("0x" + d(a + 4, 4));
            return 0 == c ? i : h + 1 * i / Math.pow(2, 52) * Math.pow(2, g)
        }
        return console.log("Not support Float length", b),
            NaN
    }
    function i() {
        function a(b) {
            function d(a, b) {
                b = b || 0;
                for (var c = 0, d = b; d < a.length; d++)
                    c <<= 8,
                        c |= 255 & a[d];
                return c
            }
            var g = b
                , i = l[b]
                , k = 240 & i
                , m = 15 & i;
            if (b++ ,
                15 == m) {
                var n = Math.pow(2, 15 & l[b++]);
                m = f(b, n),
                    b += n
            }
            switch (k) {
                case 0:
                    return 0 == m ? null : 9 == m;
                case 16:
                    var n = Math.pow(2, m);
                    return f(b, n);
                case 32:
                    var n = Math.pow(2, m)
                        , o = h(b, n);
                    return o;
                case 48:
                    var p = h(b, 8)
                        , q = p + 978307200
                        , r = new Date(1e3 * q);
                    return r;
                case 64:
                    console.log("TODO: Test This");
                    var s = l.subarray(b, b + m)
                        , t = s.buffer
                        , u = new Blob([t]);
                    return u;
                case 128:
                case 80:
                    return e(b, m);
                case 96:
                    return e(b, m, !0);
                case 160:
                case 192:
                    for (var v = [], w = 0; w < m; w++) {
                        for (var x = [], y = b + w * c; y < b + (w + 1) * c; y++)
                            x.push(l[y]);
                        var z = d(x)
                            , A = j[z];
                        v[w] = a(A)
                    }
                    return v;
                case 208:
                    for (var B = {}, w = 0; w < m; w++) {
                        for (var x = [], y = b + w * c; y < b + (w + 1) * c; y++)
                            x.push(l[y]);
                        for (var z = d(x), A = j[z], C = [], y = b + w * c + m * c; y < b + (w + 1) * c + m * c; y++)
                            C.push(l[y]);
                        var D = d(C)
                            , E = j[D];
                        if (A == g)
                            return console.error("dead loop!!"),
                                B;
                        var F = a(A)
                            , G = a(E);
                        B[F] = G
                    }
                    return B;
                default:
                    console.error("cat read object type: " + k)
            }
        }
        var b, c, d, g, i, j = new Array;
        b = f(l.length - 32 + 6, 1),
            c = f(l.length - 32 + 7, 1),
            d = h(l.length - 32 + 8, 8),
            g = h(l.length - 32 + 16, 8),
            i = h(l.length - 32 + 24, 8);
        for (var k = 0; k < d; k++)
            j[k] = f(i + k * b, b);
        return a(j[g])
    }
    function j() {
        return b(a, c)
    }
    function k() {
        var d = new FileReader;
        d.onload = function (a) {
            l = new Uint8Array(d.result);
            var f, h = e(0, 6);
            if ("bplist" == h)
                f = m.readBinary(),
                    c(f);
            else if ("<?xml " == h) {
                var i = g.getStringFromBytes(l);
                b(i, c)
            } else {
                var i = g.getStringFromBytes(l)
                    , j = i.indexOf("<?xml")
                    , k = i.lastIndexOf(">");
                j != -1 && k != -1 && b(i.substring(j, k + 1), c)
            }
        }
            ,
            d.onerror = function (b) {
                b.target.error.code == b.target.error.NOT_READABLE_ERR && alert("Failed to read file: " + a.name)
            }
            ;
        try {
            d.readAsArrayBuffer(a)
        } catch (f) {
            alert(f)
        }
    }
    var l, m = window;
    m.readBinary = i,
        m.readXML = j,
        k()
}
function d(a, c) {
    try {
        var d = a.match(/<\?xml[^]+<\/plist>/gm)[0];
        b(d, c)
    } catch (e) {
        c({})
    }
}
function e(a, b) {
    var c = function (a, b) {
        function c() {
            var c = new FileReader;
            c.onload = function (a) {
                var buffer = new Uint8Array(c.result);
                var d = new i(buffer).parse()
                    , e = d.usesSdk ? d.usesSdk.minSdkVersion : "1"
                    , f = d.usesSdk ? d.usesSdk.targetSdkVersion : "1"
                    , g = [];
                g.push({
                    name: "versionCode",
                    value: d.versionCode
                }),
                    g.push({
                        name: "versionName",
                        value: d.versionName
                    }),
                    g.push({
                        name: "package",
                        value: d.package
                    }),
                    g.push({
                        name: "minSdkVersion",
                        value: e
                    }),
                    g.push({
                        name: "targetSdkVersion",
                        value: f
                    }),
                    g.push({
                        name: "icon",
                        value: d.application.icon
                    }),
                    g.push({
                        name: "label",
                        value: d.application.label
                    }),
                    b(g)
            }
                ,
                c.onerror = function (b) {
                    b.target.error.code == b.target.error.NOT_READABLE_ERR && alert("Failed to read file: " + a.name)
                }
                ;
            try {
                c.readAsArrayBuffer(a)
            } catch (d) {
                alert(d)
            }
        }
        c()
    };
    c(a, b)
}

function f(a, b, c) {
    function d(a, b) {
        var c = new j(a)
            , d = 0
            , g = c.readInt16()
            , h = c.readInt16()
            , i = c.readInt32();
        c.readInt32();
        c.Seek(h),
            g != n && console.log("No RES_TABLE_TYPE found!"),
            i != a.length && console.log("The buffer size not matches to the resource table size.");
        for (var k = 0, p = 0; ;) {
            var q = c.BasePostion
                , r = c.readInt16()
                , s = (c.readInt16(),
                    c.readInt32());
            if (r == m) {
                if (0 == k) {
                    var t = [];
                    d = c.BasePostion,
                        c.Seek(q),
                        t = c.readBytes(s),
                        l = e(t)
                }
                k++
            } else if (r == o) {
                var t = [];
                d = c.BasePostion,
                    c.Seek(q),
                    t = c.readBytes(s),
                    f(t),
                    p++
            } else
                console.log("Unsupported Type");
            if (isNaN(c.BasePostion))
                break;
            if (c.BasePostion == a.length)
                break;
            c.Seek(q + s)
        }
        b(v)
    }
    function e(a) {
        for (var b = 0, c = new j(a), d = (c.readInt16(),
            c.readInt16(),
            c.readInt32(),
            c.readInt32()), e = (c.readInt32(),
                c.readInt32()), f = c.readInt32(), g = (c.readInt32(),
                    0 != (256 & e)), h = [], i = 0; i < d; ++i)
            h[i] = c.readInt32();
        for (var k = [], i = 0; i < d; i++) {
            k[i] = "";
            var l = f + h[i];
            b = c.BasePostion,
                c.Seek(l);
            var m = l;
            if (c.Seek(b),
                m < 0) {
                c.readInt16()
            }
            if (l += 2,
                k[i] = "",
                g) {
                var n = l
                    , o = 0;
                for (b = c.BasePostion,
                    c.Seek(l); 0 != c.readByte();)
                    o++ ,
                        l++;
                c.Seek(b);
                var p = [];
                if (o > 0)
                    for (var q = 0; q < o; q++)
                        p[q] = a[n + q];
                k[i] = "",
                    p.length > 0 ? k[i] = w.getStringFromBytes(p) : k[i] = ""
            } else {
                var r;
                for (b = c.BasePostion,
                    c.Seek(l); 0 != (r = c.readInt16());)
                    k[i] += String.fromCharCode(r),
                        l += 2;
                c.Seek(b)
            }
        }
        return k
    }
    function f(a) {
        var b = 0
            , c = new j(a)
            , d = (c.readInt16(),
                c.readInt16())
            , f = (c.readInt32(),
                c.readInt32());
        package_id = f;
        for (var i = [], k = 0; k < 256; k++)
            i[k] = String.fromCharCode(c.readByte());
        var l = c.readInt32()
            , m = (c.readInt32(),
                c.readInt32());
        c.readInt32();
        l != d && console.log("TypeStrings must immediately follow the package structure header."),
            b = c.BasePostion,
            c.Seek(l);
        var n = c.readBytes(a.length - c.BasePostion);
        c.Seek(b),
            t = e(n),
            c.Seek(m);
        var o = (c.readInt16(),
            c.readInt16(),
            c.readInt32());
        b = c.BasePostion,
            c.Seek(m);
        c.readBytes(a.length - c.BasePostion);
        c.Seek(b);
        var r = 0
            , s = 0;
        for (c.Seek(m + o); ;) {
            var u = c.BasePostion
                , v = c.readInt16()
                , w = (c.readInt16(),
                    c.readInt32());
            if (v == q) {
                var x = [];
                c.Seek(u),
                    x = c.readBytes(w),
                    g(x),
                    r++
            } else if (v == p) {
                var x = [];
                c.Seek(u),
                    x = c.readBytes(w),
                    h(x),
                    s++
            }
            if (c.Seek(u + w),
                c.BasePostion == a.length)
                break
        }
    }
    function g(a) {
        for (var b = new j(a), c = (b.readInt16(),
            b.readInt16(),
            b.readInt32(),
            b.readByte(),
            b.readByte(),
            b.readInt16(),
            b.readInt32()), d = [], e = 0; e < c; ++e)
            d[e] = b.readInt32()
    }
    function h(a) {
        var b = new j(a)
            , c = (b.readInt16(),
                b.readInt16())
            , d = (b.readInt32(),
                b.readByte())
            , e = (b.readByte(),
                b.readInt16(),
                b.readInt32())
            , f = b.readInt32()
            , g = [];
        b.readInt32();
        b.Seek(c),
            c + 4 * e != f && console.log("HeaderSize, entryCount and entriesStart are not valid.");
        for (var h = [], i = 0; i < e; ++i)
            h[i] = b.readInt32();
        for (var i = 0; i < e; ++i)
            if (h[i] != -1) {
                var m = package_id << 24 | d << 16 | i
                    , n = (b.BasePostion,
                        b.readInt16(),
                        b.readInt16())
                    , o = (b.readInt32(),
                        1);
                if (0 == (n & o)) {
                    var p = (b.readInt16(),
                        b.readByte(),
                        b.readByte())
                        , q = b.readInt32()
                        , t = m
                        , w = null;
                    p == s ? w = l[q] : p == r ? (g.push({
                        id: t,
                        val: q
                    }),
                        k.push({
                            id: t,
                            val: q
                        })) : w = q,
                        u.push({
                            rsId: "@" + t
                        }),
                        v["@" + t] = v["@" + t] || [],
                        v["@" + t].push(w)
                } else
                    for (var x = (b.readInt32(),
                        b.readInt32()), y = 0; y < x; ++y)
                        var p = (b.readInt32(),
                            b.readInt16(),
                            b.readByte(),
                            b.readByte())
                            , q = b.readInt32()
            }
    }
    function i(a, b) {
        var c = new FileReader;
        c.onload = function (a) {
            var buffer = new Uint8Array(c.result);
            d(buffer, b);
        }
            ,
            c.onerror = function (b) {
                b.target.error.code == b.target.error.NOT_READABLE_ERR && alert("Failed to read file: " + a.name)
            }
            ;
        try {
            c.readAsArrayBuffer(a)
        } catch (e) {
            alert(e)
        }
    }
    var j = function (a) {
        this.BasePostion = 0,
            this.readInt16 = function () {
                for (var b = [], c = this.BasePostion, d = c; d < c + 2; d++)
                    b.push(a[d]),
                        this.BasePostion++;
                return b[0] + b[1] * Math.pow(2, 8)
            }
            ,
            this.readInt32 = function () {
                for (var b = [], c = 0, d = this.BasePostion, e = d; e < d + 4; e++) {
                    b.push(a[e]),
                        this.BasePostion++;
                    var f = e - d;
                    c += b[e - d] * Math.pow(2, 8 * f)
                }
                return "4294967295" == c && (c = -1),
                    c
            }
            ,
            this.Seek = function (a) {
                this.BasePostion = a
            }
            ,
            this.readBytes = function (b) {
                for (var c = this.BasePostion, d = [], e = c; e < c + b; e++)
                    d.push(a[e]),
                        this.BasePostion++;
                return d
            }
            ,
            this.readByte = function () {
                var b = this.BasePostion;
                return this.BasePostion++ ,
                    a[b]
            }
            ,
            this.buf = a
    }
        , k = []
        , l = []
        , m = 1
        , n = 2
        , o = 512
        , p = 513
        , q = 514
        , r = 1
        , s = 3
        , l = []
        , t = []
        , u = []
        , v = {}
        , w = {
            getCharLength: function (a) {
                return 240 == (240 & a) ? 4 : 224 == (224 & a) ? 3 : 192 == (192 & a) ? 2 : a == (127 & a) ? 1 : 0
            },
            getStringFromBytes: function (a, b, c, d) {
                var e, f = [];
                for (b = 0 | b,
                    c = "number" == typeof c ? c : a.byteLength || a.length; b < c; b++) {
                    if (e = w.getCharLength(a[b]),
                        0 == e)
                        return "";
                    if (b + e > c) {
                        if (d)
                            throw Error("Index " + b + ": Found a " + e + " bytes encoded char declaration but only " + (c - b) + " bytes are available.")
                    } else
                        f.push(String.fromCharCode(w.getCharCode(a, b, e, d)));
                    b += e - 1
                }
                return f.join("")
            },
            getCharCode: function (a, b, c) {
                var d = 0
                    , e = "";
                if (b = b || 0,
                    c = c || w.getCharLength(a[b]),
                    0 == c)
                    throw new Error(a[b].toString(2) + " is not a significative byte (offset:" + b + ").");
                if (1 === c)
                    return a[b];
                for (e = "00000000".slice(0, c) + 1 + "00000000".slice(c + 1),
                    e = "0000".slice(0, c + 1) + "11111111".slice(c + 1),
                    d += (a[b] & parseInt(e, 2)) << 6 * --c; c;)
                    d += (63 & a[++b]) << 6 * --c;
                return d
            }
        };
    i(a, function (a) {
        for (var d = 0; d < k.length; d++)
            a["@" + k[d].id] = a["@" + k[d].val];
        var e = {};
        e.icon = [],
            e.label = [];
        for (var f = b.length - 1; f >= 0; f--)
            "icon" != b[f].name && "label" != b[f].name || (e[b[f].name] = a[b[f].value]);
        for (var g = {}, d = b.length - 1; d >= 0; d--)
            g[b[d].name] = b[d].value;
        var h, i, j, l;
        e.icon = e.icon || [];
        for (var d = 0; d < e.icon.length; d++) {
            if (e.icon.join(",").indexOf("xhdpi") < 0 && e.icon.join(",").indexOf("hdpi") < 0 && e.icon.join(",").indexOf("xxhdpi") < 0 && e.icon.join(",").indexOf("xxxhdpi") < 0) {
                g.icon = e.icon[0];
                break
            }
            e.icon[d] && (e.icon[d].indexOf("xxxhdpi") >= 0 && (l = e.icon[d]),
                e.icon[d].indexOf("xxhdpi") >= 0 && (j = e.icon[d]),
                e.icon[d].indexOf("xhdpi") >= 0 && (i = e.icon[d]),
                e.icon[d].indexOf("hdpi") >= 0 && (h = e.icon[d]))
        }
        h && (g.icon = h),
            i && (g.icon = i),
            j && (g.icon = j),
            l && (g.icon = l),
            e.label && e.label.length > 0 ? g.label = e.label[0] : g.label = g.label;
        for (var m in g)
            g[m] && 0 == g[m].toString().indexOf("@") && a[g[m]] && a[g[m]].length > 0 && (g[m] = a[g[m]][0]);
        c(g)
    })
}
var g = {
    getCharLength: function (a) {
        return 240 == (240 & a) ? 4 : 224 == (224 & a) ? 3 : 192 == (192 & a) ? 2 : a == (127 & a) ? 1 : 0
    },
    getStringFromBytes: function (a, b, c, d) {
        var e, f = [];
        for (b = 0 | b,
            c = "number" == typeof c ? c : a.byteLength || a.length; b < c; b++) {
            if (e = g.getCharLength(a[b]),
                0 == e)
                return "";
            if (b + e > c) {
                if (d)
                    throw Error("Index " + b + ": Found a " + e + " bytes encoded char declaration but only " + (c - b) + " bytes are available.")
            } else
                f.push(String.fromCharCode(g.getCharCode(a, b, e, d)));
            b += e - 1
        }
        return f.join("")
    },
    getCharCode: function (a, b, c) {
        var d = 0
            , e = "";
        if (b = b || 0,
            c = c || g.getCharLength(a[b]),
            0 == c)
            throw new Error(a[b].toString(2) + " is not a significative byte (offset:" + b + ").");
        if (1 === c)
            return a[b];
        for (e = "00000000".slice(0, c) + 1 + "00000000".slice(c + 1),
            e = "0000".slice(0, c + 1) + "11111111".slice(c + 1),
            d += (a[b] & parseInt(e, 2)) << 6 * --c; c;)
            d += (63 & a[++b]) << 6 * --c;
        return d
    }
};

var h, i, h = function () {
    function a(a) {
        this.buffer = a,
            this.cursor = 0,
            this.strings = [],
            this.resources = [],
            this.document = null,
            this.parent = null,
            this.stack = []
    }
    var b, c, d, e;
    return c = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        CDATA_SECTION_NODE: 4
    },
        b = {
            NULL: 0,
            STRING_POOL: 1,
            TABLE: 2,
            XML: 3,
            XML_FIRST_CHUNK: 256,
            XML_START_NAMESPACE: 256,
            XML_END_NAMESPACE: 257,
            XML_START_ELEMENT: 258,
            XML_END_ELEMENT: 259,
            XML_CDATA: 260,
            XML_LAST_CHUNK: 383,
            XML_RESOURCE_MAP: 384,
            TABLE_PACKAGE: 512,
            TABLE_TYPE: 513,
            TABLE_TYPE_SPEC: 514
        },
        d = {
            SORTED: 1,
            UTF8: 256
        },
        e = {
            COMPLEX_MANTISSA_MASK: 16777215,
            COMPLEX_MANTISSA_SHIFT: 8,
            COMPLEX_RADIX_0p23: 3,
            COMPLEX_RADIX_16p7: 1,
            COMPLEX_RADIX_23p0: 0,
            COMPLEX_RADIX_8p15: 2,
            COMPLEX_RADIX_MASK: 3,
            COMPLEX_RADIX_SHIFT: 4,
            COMPLEX_UNIT_DIP: 1,
            COMPLEX_UNIT_FRACTION: 0,
            COMPLEX_UNIT_FRACTION_PARENT: 1,
            COMPLEX_UNIT_IN: 4,
            COMPLEX_UNIT_MASK: 15,
            COMPLEX_UNIT_MM: 5,
            COMPLEX_UNIT_PT: 3,
            COMPLEX_UNIT_PX: 0,
            COMPLEX_UNIT_SHIFT: 0,
            COMPLEX_UNIT_SP: 2,
            DENSITY_DEFAULT: 0,
            DENSITY_NONE: 65535,
            TYPE_ATTRIBUTE: 2,
            TYPE_DIMENSION: 5,
            TYPE_FIRST_COLOR_INT: 28,
            TYPE_FIRST_INT: 16,
            TYPE_FLOAT: 4,
            TYPE_FRACTION: 6,
            TYPE_INT_BOOLEAN: 18,
            TYPE_INT_COLOR_ARGB4: 30,
            TYPE_INT_COLOR_ARGB8: 28,
            TYPE_INT_COLOR_RGB4: 31,
            TYPE_INT_COLOR_RGB8: 29,
            TYPE_INT_DEC: 16,
            TYPE_INT_HEX: 17,
            TYPE_LAST_COLOR_INT: 31,
            TYPE_LAST_INT: 31,
            TYPE_NULL: 0,
            TYPE_REFERENCE: 1,
            TYPE_STRING: 3
        },
        a.prototype.readU8 = function () {
            var a;
            return a = this.buffer[this.cursor],
                this.cursor += 1,
                a
        }
        ,
        a.prototype.readU16 = function () {
            var a, b = this.buffer, c = this.cursor, d = !0, e = b.length;
            if (!(c >= e)) {
                var a;
                return d ? (a = b[c],
                    c + 1 < e && (a |= b[c + 1] << 8)) : (a = b[c] << 8,
                        c + 1 < e && (a |= b[c + 1])),
                    this.cursor += 2,
                    a
            }
        }
        ,
        a.prototype.readS32 = function () {
            var a = this.buffer
                , b = this.cursor
                , c = !0
                , d = a.length;
            if (!(b >= d)) {
                var e;
                c ? (b + 2 < d && (e = a[b + 2] << 16),
                    b + 1 < d && (e |= a[b + 1] << 8),
                    e |= a[b],
                    b + 3 < d && (e += a[b + 3] << 24 >>> 0)) : (b + 1 < d && (e = a[b + 1] << 16),
                        b + 2 < d && (e |= a[b + 2] << 8),
                        b + 3 < d && (e |= a[b + 3]),
                        e += a[b] << 24 >>> 0),
                    this.cursor += 4;
                var f = 2147483648 & e;
                return f ? (4294967295 - e + 1) * -1 : e
            }
        }
        ,
        a.prototype.readU32 = function () {
            var a, b = this.buffer.length, c = this.buffer, d = this.cursor;
            if (!(d >= b)) {
                var a, e = !0;
                return e ? (d + 2 < b && (a = c[d + 2] << 16),
                    d + 1 < b && (a |= c[d + 1] << 8),
                    a |= c[d],
                    d + 3 < b && (a += c[d + 3] << 24 >>> 0)) : (d + 1 < b && (a = c[d + 1] << 16),
                        d + 2 < b && (a |= c[d + 2] << 8),
                        d + 3 < b && (a |= c[d + 3]),
                        a += c[d] << 24 >>> 0),
                    this.cursor += 4,
                    a
            }
        }
        ,
        a.prototype.readLength8 = function () {
            var a;
            return a = this.readU8(),
                128 & a && (a = (127 & a) << 7,
                    a += this.readU8()),
                a
        }
        ,
        a.prototype.readLength16 = function () {
            var a;
            return a = this.readU16(),
                32768 & a && (a = (32767 & a) << 15,
                    a += this.readU16()),
                a
        }
        ,
        a.prototype.readDimension = function () {
            var a, b, c;
            switch (a = {
                value: null,
                unit: null,
                rawUnit: null
            },
            c = this.readU32(),
            b = 255 & a.value,
            a.value = c >> 8,
            a.rawUnit = b,
            b) {
                case e.COMPLEX_UNIT_MM:
                    a.unit = "mm";
                    break;
                case e.COMPLEX_UNIT_PX:
                    a.unit = "px";
                    break;
                case e.COMPLEX_UNIT_DIP:
                    a.unit = "dp";
                    break;
                case e.COMPLEX_UNIT_SP:
                    a.unit = "sp";
                    break;
                case e.COMPLEX_UNIT_PT:
                    a.unit = "pt";
                    break;
                case e.COMPLEX_UNIT_IN:
                    a.unit = "in"
            }
            return a
        }
        ,
        a.prototype.readFraction = function () {
            var a, b, c;
            switch (a = {
                value: null,
                type: null,
                rawType: null
            },
            c = this.readU32(),
            b = 15 & c,
            a.value = this.convertIntToFloat(c >> 4),
            a.rawType = b,
            b) {
                case e.COMPLEX_UNIT_FRACTION:
                    a.type = "%";
                    break;
                case e.COMPLEX_UNIT_FRACTION_PARENT:
                    a.type = "%p"
            }
            return a
        }
        ,
        a.prototype.readHex24 = function () {
            return (16777215 & this.readU32()).toString(16)
        }
        ,
        a.prototype.readHex32 = function () {
            return this.readU32().toString(16)
        }
        ,
        a.prototype.readTypedValue = function () {
            var a, b, c, d, f, g, h, i, j, k;
            switch (j = {
                value: null,
                type: null,
                rawType: null
            },
            h = this.cursor,
            g = this.readU16(),
            k = this.readU8(),
            a = this.readU8(),
            j.rawType = a,
            a) {
                case e.TYPE_INT_DEC:
                    j.value = this.readS32(),
                        j.type = "int_dec";
                    break;
                case e.TYPE_INT_HEX:
                    j.value = this.readS32(),
                        j.type = "int_hex";
                    break;
                case e.TYPE_STRING:
                    f = this.readS32(),
                        j.value = f > 0 ? this.strings[f] : "",
                        j.type = "string";
                    break;
                case e.TYPE_REFERENCE:
                    d = this.readU32(),
                        j.value = "@" + d,
                        j.type = "reference";
                    break;
                case e.TYPE_INT_BOOLEAN:
                    j.value = 0 !== this.readS32(),
                        j.type = "boolean";
                    break;
                case e.TYPE_NULL:
                    this.readU32(),
                        j.value = null,
                        j.type = "null";
                    break;
                case e.TYPE_INT_COLOR_RGB8:
                    j.value = this.readHex24(),
                        j.type = "rgb8";
                    break;
                case e.TYPE_INT_COLOR_RGB4:
                    j.value = this.readHex24(),
                        j.type = "rgb4";
                    break;
                case e.TYPE_INT_COLOR_ARGB8:
                    j.value = this.readHex32(),
                        j.type = "argb8";
                    break;
                case e.TYPE_INT_COLOR_ARGB4:
                    j.value = this.readHex32(),
                        j.type = "argb4";
                    break;
                case e.TYPE_DIMENSION:
                    j.value = this.readDimension(),
                        j.type = "dimension";
                    break;
                case e.TYPE_FRACTION:
                    j.value = this.readFraction(),
                        j.type = "fraction";
                    break;
                default:
                    i = a.toString(16),
                        j.value = this.readU32(),
                        j.type = "unknown"
            }
            return c = h + g,
                this.cursor !== c && (i = a.toString(16),
                    b = c - this.cursor,
                    this.cursor = c),
                j
        }
        ,
        a.prototype.convertIntToFloat = function (a) {
            var b;
            return b = new ArrayBuffer(4),
                new (Int32Array(b)[0] = b),
                new Float32Array(b)[0]
        }
        ,
        a.prototype.readString = function (a) {
            function b(a, b, c) {
                for (var d = a.slice(b, c), e = "", f = 0; f < d.length; f += 2)
                    e += String.fromCharCode(d[f] + 256 * d[f + 1]);
                return e
            }
            var c, d, e;
            switch (a) {
                case "utf-8":
                    d = this.readLength8(a),
                        c = this.readLength8(a);
                    var f = [];
                    return f = this.readbytes(c),
                        e = g.getStringFromBytes(f),
                        this.readU16(),
                        e;
                case "ucs2":
                    return d = this.readLength16(a),
                        c = 2 * d,
                        f = this.readbytes(c),
                        e = b(f, 0, f.length),
                        this.readU16(),
                        e;
                default:
                    throw new Error("Unsupported encoding '" + a + "'")
            }
        }
        ,
        a.prototype.readbytes = function (a) {
            for (var b = this.cursor, c = [], d = b; d < b + a; d++)
                c.push(this.buffer[d]),
                    this.cursor++;
            return c
        }
        ,
        a.prototype.readChunkHeader = function () {
            return {
                chunkType: this.readU16(),
                headerSize: this.readU16(),
                chunkSize: this.readU32()
            }
        }
        ,
        a.prototype.readStringPool = function (a) {
            var c, e, f, g, h, i;
            if (a.stringCount = this.readU32(),
                a.styleCount = this.readU32(),
                a.flags = this.readU32(),
                a.stringsStart = this.readU32(),
                a.stylesStart = this.readU32(),
                a.chunkType !== b.STRING_POOL)
                throw new Error("Invalid string pool header");
            c = this.cursor,
                f = [];
            var j = c + a.stringsStart - a.headerSize
                , k = -1
                , l = null;
            for (g = 0,
                i = a.stringCount; 0 <= i ? g < i : g > i; 0 <= i ? g++ : g--)
                f.push(j + this.readU32());
            e = a.flags & d.UTF8 ? "utf-8" : "ucs2",
                this.cursor = c + a.stringsStart - a.headerSize;
            for (var h = 0; h < f.length; h++)
                if (f[h] != k) {
                    this.cursor = f[h],
                        k = f[h];
                    var m = this.readString(e);
                    l = m,
                        this.strings.push(m)
                } else
                    this.strings.push(l);
            return this.cursor = c + a.chunkSize - a.headerSize,
                null
        }
        ,
        a.prototype.readResourceMap = function (a) {
            var b, c;
            for (b = Math.floor((a.chunkSize - a.headerSize) / 4),
                c = 0; 0 <= b ? c < b : c > b; 0 <= b ? c++ : c--)
                this.resources.push(this.readU32());
            return null
        }
        ,
        a.prototype.readXmlNamespaceStart = function (a) {
            var b, c, d, e;
            return c = this.readU32(),
                b = this.readU32(),
                d = this.readS32(),
                e = this.readS32(),
                null
        }
        ,
        a.prototype.readXmlNamespaceEnd = function (a) {
            var b, c, d, e;
            return c = this.readU32(),
                b = this.readU32(),
                d = this.readS32(),
                e = this.readS32(),
                null
        }
        ,
        a.prototype.readXmlElementStart = function (a) {
            var b, d, e, f, g, h, i, j, k, l, m, n;
            for (k = {
                namespaceURI: null,
                nodeType: c.ELEMENT_NODE,
                nodeName: null,
                attributes: [],
                childNodes: []
            },
                i = this.readU32(),
                g = this.readU32(),
                l = this.readS32(),
                j = this.readS32(),
                l > 0 && (k.namespaceURI = this.strings[l]),
                k.nodeName = this.strings[j],
                e = this.readU16(),
                d = this.readU16(),
                b = this.readU16(),
                h = this.readU16(),
                f = this.readU16(),
                m = this.readU16(),
                n = 0; 0 <= b ? n < b : n > b; 0 <= b ? n++ : n--)
                k.attributes.push(this.readXmlAttribute());
            return this.document ? (this.parent.childNodes.push(k),
                this.parent = k) : this.document = this.parent = k,
                this.stack.push(k),
                k
        }
        ,
        a.prototype.readXmlAttribute = function () {
            var a, b, d, e;
            return a = {
                namespaceURI: null,
                nodeType: c.ATTRIBUTE_NODE,
                nodeName: null,
                name: null,
                value: null,
                typedValue: null
            },
                d = this.readS32(),
                b = this.readS32(),
                e = this.readS32(),
                d > 0 && (a.namespaceURI = this.strings[d]),
                a.nodeName = a.name = this.strings[b],
                e > 0 && (a.value = this.strings[e]),
                a.typedValue = this.readTypedValue(),
                a
        }
        ,
        a.prototype.readXmlElementEnd = function (a) {
            var b, c, d, e;
            return c = this.readU32(),
                b = this.readU32(),
                e = this.readS32(),
                d = this.readS32(),
                this.stack.pop(),
                this.parent = this.stack[this.stack.length - 1],
                null
        }
        ,
        a.prototype.readXmlCData = function (a) {
            var b, d, e, f;
            return b = {
                namespaceURI: null,
                nodeType: c.CDATA_SECTION_NODE,
                nodeName: "#cdata",
                data: null,
                typedValue: null
            },
                f = this.readU32(),
                d = this.readU32(),
                e = this.readS32(),
                e > 0 && (b.data = this.strings[e]),
                b.typedValue = this.readTypedValue(),
                this.parent.childNodes.push(b),
                b
        }
        ,
        a.prototype.readNull = function (a) {
            return this.cursor += a.chunkSize - a.headerSize,
                null
        }
        ,
        a.prototype.parse = function () {
            var a, c, d, e, f, g, h;
            if (h = this.readChunkHeader(),
                h.chunkType !== b.XML)
                throw new Error("Invalid XML header");
            for (this.readStringPool(this.readChunkHeader()),
                e = this.readChunkHeader(),
                e.chunkType === b.XML_RESOURCE_MAP ? (this.readResourceMap(e),
                    this.readXmlNamespaceStart(this.readChunkHeader())) : this.readXmlNamespaceStart(e); this.cursor < this.buffer.length;) {
                switch (f = this.cursor,
                d = this.readChunkHeader(),
                d.chunkType) {
                    case b.XML_START_NAMESPACE:
                        this.readXmlNamespaceStart(d);
                        break;
                    case b.XML_END_NAMESPACE:
                        this.readXmlNamespaceEnd(d);
                        break;
                    case b.XML_START_ELEMENT:
                        this.readXmlElementStart(d);
                        break;
                    case b.XML_END_ELEMENT:
                        this.readXmlElementEnd(d);
                        break;
                    case b.XML_CDATA:
                        this.readXmlCData(d);
                        break;
                    case b.NULL:
                        this.readNull(d);
                        break;
                    default:
                        throw new Error("Unsupported chunk type '" + d.chunkType + "'")
                }
                c = f + d.chunkSize,
                    this.cursor !== c && (a = c - this.cursor,
                        g = d.chunkType.toString(16),
                        this.cursor = c)
            }
            return this.document
        }
        ,
        a
}(), i = function () {
    function a(a) {
        this.buffer = a,
            this.xmlParser = new h(this.buffer)
    }
    var b, c, d;
    return d = "http://schemas.android.com/apk/res/android",
        c = "android.intent.action.MAIN",
        b = "android.intent.category.LAUNCHER",
        a.prototype.collapseAttributes = function (a) {
            var b, c, d, e, f;
            for (c = Object.create(null),
                f = a.attributes,
                d = 0,
                e = f.length; d < e; d++)
                b = f[d],
                    c[b.name] = b.typedValue.value;
            return c
        }
        ,
        a.prototype.parseIntents = function (a, b) {
            return b.intentFilters = [],
                b.metaData = [],
                a.childNodes.forEach(function (a) {
                    return function (c) {
                        var d;
                        switch (c.nodeName) {
                            case "intent-filter":
                                return d = a.collapseAttributes(c),
                                    d.actions = [],
                                    d.categories = [],
                                    d.data = [],
                                    c.childNodes.forEach(function (b) {
                                        switch (b.nodeName) {
                                            case "action":
                                                return d.actions.push(a.collapseAttributes(b));
                                            case "category":
                                                return d.categories.push(a.collapseAttributes(b));
                                            case "data":
                                                return d.data.push(a.collapseAttributes(b))
                                        }
                                    }),
                                    b.intentFilters.push(d);
                            case "meta-data":
                                return b.metaData.push(a.collapseAttributes(c))
                        }
                    }
                }(this))
        }
        ,
        a.prototype.parseApplication = function (a) {
            var b;
            return b = this.collapseAttributes(a),
                b.activities = [],
                b.activityAliases = [],
                b.launcherActivities = [],
                b.services = [],
                b.receivers = [],
                b.providers = [],
                b.usesLibraries = [],
                a.childNodes.forEach(function (a) {
                    return function (c) {
                        var d, e, f, g, h;
                        switch (c.nodeName) {
                            case "activity":
                                if (d = a.collapseAttributes(c),
                                    a.parseIntents(c, d),
                                    b.activities.push(d),
                                    a.isLauncherActivity(d))
                                    return b.launcherActivities.push(d);
                                break;
                            case "activity-alias":
                                if (e = a.collapseAttributes(c),
                                    a.parseIntents(c, e),
                                    b.activityAliases.push(e),
                                    a.isLauncherActivity(e))
                                    return b.launcherActivities.push(e);
                                break;
                            case "service":
                                return h = a.collapseAttributes(c),
                                    a.parseIntents(c, h),
                                    b.services.push(h);
                            case "receiver":
                                return g = a.collapseAttributes(c),
                                    a.parseIntents(c, g),
                                    b.receivers.push(g);
                            case "provider":
                                return f = a.collapseAttributes(c),
                                    f.grantUriPermissions = [],
                                    f.metaData = [],
                                    f.pathPermissions = [],
                                    c.childNodes.forEach(function (b) {
                                        switch (b.nodeName) {
                                            case "grant-uri-permission":
                                                return f.grantUriPermissions.push(a.collapseAttributes(b));
                                            case "meta-data":
                                                return f.metaData.push(a.collapseAttributes(b));
                                            case "path-permission":
                                                return f.pathPermissions.push(a.collapseAttributes(b))
                                        }
                                    }),
                                    b.providers.push(f);
                            case "uses-library":
                                return b.usesLibraries.push(a.collapseAttributes(c))
                        }
                    }
                }(this)),
                b
        }
        ,
        a.prototype.isLauncherActivity = function (a) {
            return a.intentFilters.some(function (a) {
                var d;
                return d = a.actions.some(function (a) {
                    return a.name === c
                }),
                    !!d && a.categories.some(function (a) {
                        return a.name === b
                    })
            })
        }
        ,
        a.prototype.parse = function () {
            var a, b;
            return a = this.xmlParser.parse(),
                b = this.collapseAttributes(a),
                b.usesPermissions = [],
                b.permissions = [],
                b.permissionTrees = [],
                b.permissionGroups = [],
                b.instrumentation = null,
                b.usesSdk = null,
                b.usesConfiguration = null,
                b.usesFeatures = [],
                b.supportsScreens = null,
                b.compatibleScreens = [],
                b.supportsGlTextures = [],
                b.application = Object.create(null),
                a.childNodes.forEach(function (a) {
                    return function (c) {
                        switch (c.nodeName) {
                            case "uses-permission":
                                return b.usesPermissions.push(a.collapseAttributes(c));
                            case "permission":
                                return b.permissions.push(a.collapseAttributes(c));
                            case "permission-tree":
                                return b.permissionTrees.push(a.collapseAttributes(c));
                            case "permission-group":
                                return b.permissionGroups.push(a.collapseAttributes(c));
                            case "instrumentation":
                                return b.instrumentation = a.collapseAttributes(c);
                            case "uses-sdk":
                                return b.usesSdk = a.collapseAttributes(c);
                            case "uses-configuration":
                                return b.usesConfiguration = a.collapseAttributes(c);
                            case "uses-feature":
                                return b.usesFeatures.push(a.collapseAttributes(c));
                            case "supports-screens":
                                return b.supportsScreens = a.collapseAttributes(c);
                            case "compatible-screens":
                                return c.childNodes.forEach(function (c) {
                                    return b.compatibleScreens.push(a.collapseAttributes(c))
                                });
                            case "supports-gl-texture":
                                return b.supportsGlTextures.push(a.collapseAttributes(c));
                            case "application":
                                return b.application = a.parseApplication(c)
                        }
                    }
                }(this)),
                b
        }
        ,
        a
}();

export const getPlist = c;
export const getUdids = d;
export const getXMLPlist = b;
export const parseApkinit = f;
export const ApkManifestReader = e;
export const BinaryXmlParser = h;
export const ManifestParser = i;
export { PNGConvertor, PNGReader };

// a.getPlist = c;
// a.getUdids = d;
// a.getXMLPlist = b;
// a.parseApkinit = f;
// a.ApkManifestReader = e;
// a.BinaryXmlParser = h;
// a.ManifestParser = i;