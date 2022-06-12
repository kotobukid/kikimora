"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_datetime_1 = require("./parse_datetime");
var out = function (value) {
    process.stdout.write("".concat(value));
};
var assert_equal = function (a, b) {
    if (a === b) {
        out('.');
    }
    else {
        console.error("\n".concat(a, ", ").concat(b));
    }
};
var to_channel_name = function (r) {
    if (r.m !== '') {
        if (r.d !== '') {
            console.log("".concat(r.m, "\u6708").concat(r.d, "\u65E5 ").concat(r.message_payload));
        }
        else {
            console.log("".concat(r.m, "\u6708 ").concat(r.message_payload));
        }
    }
    else {
        console.log(r.message_payload);
    }
};
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('1225クリスマス');
    assert_equal(r.m, '12');
    assert_equal(r.d, '25');
    assert_equal(r.message_payload, 'クリスマス');
    to_channel_name(r);
})();
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('１２２５クリスマス');
    assert_equal(r.m, '12');
    assert_equal(r.d, '25');
    assert_equal(r.message_payload, 'クリスマス');
    to_channel_name(r);
})();
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('01 元旦');
    assert_equal(r.m, '01');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '元旦');
    to_channel_name(r);
})();
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('元旦');
    assert_equal(r.m, '');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '元旦');
    to_channel_name(r);
})();
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('8盆');
    assert_equal(r.m, '');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '8盆');
    to_channel_name(r);
})();
out('\n');
