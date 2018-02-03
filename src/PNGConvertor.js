// ipa包需要用到
export default function PNGConvertor(a) {
    var b, c, d, g, h, i, j, k, m, n, o;
    var width = null != a ? a.width : void 0;
    var height = null != a ? a.height : void 0;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    m = canvas.getContext("2d");
    if ("string" == typeof a) return g = a;
    if ("object" == typeof a) {
        b = m.getImageData(0, 0, width, height)
        for (d = 0, o = h = 0, j = height; 0 <= j ? h < j : h > j; o = 0 <= j ? ++h : --h) {
            for (n = i = 0, k = width; 0 <= k ? i < k : i > k; n = 0 <= k ? ++i : --i) {
                c = a.getPixel(n, o);
                b.data[d++] = c[0];
                b.data[d++] = c[1];
                b.data[d++] = c[2];
                b.data[d++] = c[3];
            }
        }
        m.putImageData(b, 0, 0);
        return canvas.toDataURL()
    }
}