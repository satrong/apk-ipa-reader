"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (a, c) {
    var f,
        i,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u,
        h = 0,
        k = 0;
    var p = false;
    for (u = 0, o = 0, f = 0, n = 0, q = 0; q < a.length;) {
        i = a[q];
        if ("iTunesMetadata.plist" === i.filename) p = true;
        if (0 === f && i.filename.indexOf("embedded.mobileprovision") >= 0 && i.filename.indexOf("._embedded.mobileprovision") < 0) f = i;
        q++;
    }

    for (t = {}; n < a.length;) {
        i = a[n];
        m = i.filename.toLowerCase().split(".app/");
        m = m.length > 1 ? m[1] : m[0];
        0 === u && "info.plist" === m && (u = i);
        "icon@3x.png" === m && (t["icon@3x.png"] = i);
        "icon@2x.png" === m && (t["icon@2x.png"] = i);
        m.indexOf("60x60@2x") > 0 && (t["60x60@2x"] = i);
        m.indexOf("60x60@3x") > 0 && (t["60x60@3x"] = i);
        m.indexOf("57x57@2x") > 0 && (t["57x57@2x"] = i);
        m.indexOf("57x57@3x") > 0 && (t["57x57@3x"] = i);
        m.indexOf("76x76@2x~ipad.png") > 0 && (t["76x76@2x~ipad.png"] = i);
        m.indexOf("40x40@2x~ipad.png") > 0 && (t["40x40@2x~ipad.png"] = i);
        m.indexOf("29x29@2x~ipad.png") > 0 && (t["29x29@2x~ipad.png"] = i);
        "icon.png" === m && (t["icon.png"] = i);
        n++;
    }

    function getIcon(a) {
        o = a;
        o.getData(new zip.BlobWriter(a), function (a) {
            var b = new FileReader();
            b.readAsArrayBuffer(a);
            b.onload = function (b) {
                var d = b.target.result;
                var e = new _lib.PNGReader(d);
                e.parse(function (b, d) {
                    g.iconBlob = a;
                    j = 1;
                    if (b) {
                        var e = window.URL || window.webkitURL || window.mozURL;
                        g.icon = decodeURIComponent(e.createObjectURL(a));
                    } else {
                        g.icon = d;
                    }
                    // c("1 found");
                });
            };
        });
    };

    t["60x60@3x"] ? getIcon(t["60x60@3x"]) : t["60x60@2x"] ? getIcon(t["60x60@2x"]) : t["57x57@3x"] ? getIcon(t["57x57@3x"]) : t["57x57@2x"] ? getIcon(t["57x57@2x"]) : t["icon@3x.png"] ? getIcon(t["icon@3x.png"]) : t["icon@2x.png"] ? getIcon(t["icon@2x.png"]) : t["76x76@2x~ipad.png"] ? getIcon(t["76x76@2x~ipad.png"]) : t["40x40@2x~ipad.png"] ? getIcon(t["40x40@2x~ipad.png"]) : t["29x29@2x~ipad.png"] ? getIcon(t["29x29@2x~ipad.png"]) : t["icon.png"] && getIcon(t["icon.png"]);

    if (f !== 0) {
        s = function s(a) {
            a.ProvisionsAllDevices ? (g.release_type = "inhouse", g.distributionName = a.Name + ": " + a.TeamName) : a.ProvisionedDevices ? (g.release_type = "adhoc", g.devices = a.ProvisionedDevices) : g.release_type = "store", g.expire_at = a.ExpirationDate, h = 1;
            // c("embedded ready")
        };
        f.getData(new zip.TextWriter(), function (a) {
            return (0, _lib.getUdids)(a, s);
        });
    } else {
        if (p) {
            g.release_type = "store";
        } else {
            g.release_type = "adhoc";
            h = 1;
            // c("embedded ready");
        }
    }

    if (u !== 0) {
        r = function r(b) {
            var e, f, h, l, p, q, r, s, t;
            try {
                b.CFBundleDisplayName;
            } catch (u) {
                p = u;
            }
            if (0 === o) {
                q = b.CFBundleIcons || b.CFBundleIconFiles;
                if (!q && (f = b.CFBundleIconFile)) {
                    for (h = 0; h < a.length;) {
                        e = a[h];
                        m = e.filename;
                        if (m.indexOf(f) >= 0) {
                            o = e;
                            break;
                        }
                        h++;
                    }
                }

                if (q) for (q instanceof Array || (q = b.CFBundleIcons && b.CFBundleIcons.CFBundlePrimaryIcon ? b.CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles : b.CFBundleIconFiles && b.CFBundleIconFiles instanceof Array ? b.CFBundleIconFiles : []), n = 0; n < q.length;) {
                    if (t = q[n].toLowerCase(), t.indexOf("@3x.png") > 0 || t.indexOf("icon-60") >= 0 || t.indexOf("@2x.png") > 0 || t.indexOf("114") >= 0 || t.indexOf("120.") >= 0 || t.indexOf("144") >= 0 || t.indexOf("40x40") >= 0) {
                        for (r = 0; r < a.length;) {
                            if (i = a[r], m = i.filename.toLowerCase().split(".app/"), m = m.length > 1 ? m[1] : m[0], t.indexOf(".png") < 1 && (l = t + ".png"), m === t || m === l) {
                                o = i;
                                break;
                            }
                            r++;
                        }
                        if (o) break;
                    }
                    n++;
                }
                if (0 !== o) {
                    o.getData(new zip.BlobWriter(i), function (a) {
                        var b = new FileReader();
                        b.readAsArrayBuffer(a);
                        b.onload = function (b) {
                            var d = b.target.result;
                            var e = new _lib.PNGReader(d);
                            e.parse(function (b, d) {
                                g.iconBlob = a;
                                j = 1;
                                if (b) {
                                    var e = window.URL || window.webkitURL;
                                    g.icon = decodeURIComponent(e.createObjectURL(a));
                                } else {
                                    g.icon = d;
                                }
                                // c("2 found");
                            });
                        };
                    });
                } else {
                    j = 1;
                    // c("2");
                }
            }

            g.name = b.CFBundleDisplayName || b.CFBundleName;
            g.version = b.CFBundleVersion;
            g.supportedPlatform = b.UIDeviceFamily;
            g.UIRequiredDeviceCapabilities = b.UIRequiredDeviceCapabilities;
            g.MinimumOSVersion = b.MinimumOSVersion;
            g.UIDeviceFamily = b.UIDeviceFamily;
            s = b.CFBundleShortVersionString;

            if ("undefined" == typeof s) {
                g.versionShort = "1.0";
            } else {
                g.versionShort = s;
                g.id = b.CFBundleIdentifier;
                k = 1;
            }
            g.icon = (0, _lib.PNGConvertor)(g.icon);
            g.ext = 'ipa';
            c(null, g);
        };
        u.getData(new zip.BlobWriter(i), function (a) {
            (0, _lib.getPlist)(a, r);
        });
    } else {
        c("文件解析失败");
    }
};

var _lib = require("./lib.js");

var g = {};
var j = 0;

/**
 * 处理ipa包里面的文件
 * @param {Array} a 通过zip解包后得到的文件列表
 * @param {Function} c 回调函数
 */