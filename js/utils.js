
window.utils = {
	 w: function(e, t) {
		e = e || 0,
		t = t || 0;
		var a = e.toString().split(".");
		return 1 == a.length ? a[0] + "" + this.A(t) : a = a[0] + a[1].slice(0, t) + this.A(t - a[1].length)
	},
	z:function(e, t) {
		e = e || 0,
		t = t || 0;
		var a = e.toString()
		  , n = a.length;
		if(t == 0) {
			return a;
		}
		return n <= t ? "0." + this.A(t - n) + a : a.substr(0, a.length - t) + "." + a.substr(a.length - t)
	},
	A:function(e) {
		for (var t = "", a = 0; a < e; a++)
			t += "0";
		return t
	},
	precision(amount, decimals) {
		return this.z(this.w(amount, decimals),decimals);
	},
	number_format:function(number, decimals, dec_point, thousands_sep) {
		
	　　 number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	　　 var n = !isFinite(+number) ? 0 : +number,
	　　 prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
	 　　sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	 　　dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	 　　s = '',
	　　 toFixedFix = function(n, prec) {
	 　　　　var k = Math.pow(10, prec);
	 　　　　return '' + Math.ceil(n * k) / k;
	 　　};
	
	 　　s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	　　 var re = /(-?\d+)(\d{3})/;
	　　 while(re.test(s[0])) {
	 　　　　s[0] = s[0].replace(re, "$1" + sep + "$2");
	 　　}
	
	 　　if((s[1] || '').length < prec) {
	    　　 s[1] = s[1] || '';
	     　　s[1] += new Array(prec - s[1].length + 1).join('0');
	 　　}
	  　 return s.join(dec);
	},
	encode_address:function(username, s1, s2) {
		if(username == null) {return "";}
		var len = username.length;
		if(len < 12){
			return username;
		}
		var str1 = username.substr(0,  s1);
		var str2 = username.substr(0-s2, s2);
		return str1 + "...." + str2;
	},
	sleep:function(longTimes) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, longTimes);
		});
	},
	toMap:function(array, key) {
		var data = {};
		for(var i=0; i<array.length; i++) {
			data[array[i][key]] = array[i];
		}
		return data;
	},
};

Date.prototype.format = function(format) {
    format = format || 'yyyy/MM/dd hh:mm:ss';
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}

String.prototype.format = function () {
    var values = arguments;
	if(Array.isArray(values[0])) {
		values = values[0]
	}
	
    return this.replace(/\{(\d+)\}/g, function (match, index) {
        if (values.length > index) {
            return values[index];
        } else {
            return "";
        }
    });
};