Array.prototype.outlasts = function(toBeat) {
    var a = this, b = toBeat, o = 0;
    a.map((v, i) => {
        if (( !b[i] || b[i] != v ) && o == 0) o = !0;
    })
    return o
}
Number.prototype.shorter = function() {
    var milestones = {
        3: 'm', 4: 'bn', 5: 't', 6: 'Q', 7: 'q'
    }
    var f = this.toLocaleString().split(/\s/)
    var l = f.length
    if (l < 3) return f.join(', ')
    else if (l > 7) return f.join(', ')
    else return f[0] + '.' + f[1].charAt(0) + f[1].charAt(1) + milestones[l]
}
Number.prototype.Decimal2 = function() {
    var n = this, ns = this.toString()
    if (!ns.includes('.')) return ns + '.00';
    else {
        var s = ns.split('.');
        if (s[1].length == 1) s[1] += '0'
        else if (s[1].length > 2) s[1] = s[1].charAt(0) + s[1].charAt(1)
        return s.join('.')
    }
}
Number.prototype.toFullTime = function() {
    var s = Math.round(this), m = Math.floor(s / 60), h = Math.floor(m / 60), fm = m - h*60, fs = s - m*60,
    c = (p = 0) => {
        return p.toString().length==1?'0'+p:p
    }
    return `${c(h)}:${c(m - h * 60)}:${c(s - m * 60)}`
}
String.prototype.capitaliseFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}