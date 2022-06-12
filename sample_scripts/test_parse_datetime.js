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
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('1225クリスマス');
    assert_equal(r.m, '12');
    assert_equal(r.d, '25');
    assert_equal(r.message_payload, 'クリスマス');
})();
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('１２２５クリスマス');
    assert_equal(r.m, '12');
    assert_equal(r.d, '25');
    assert_equal(r.message_payload, 'クリスマス');
})();
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('01 元旦');
    assert_equal(r.m, '01');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '元旦');
})();
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('元旦');
    assert_equal(r.m, '');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '元旦');
})();
(function () {
    var r = (0, parse_datetime_1.parse_datetime)('1元旦');
    assert_equal(r.m, '');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '1元旦');
})();
out('\n');
