import {parse_datetime} from "./parse_datetime";

const out = (value: any) => {
    process.stdout.write(`${value}`);
}


const assert_equal = <T>(a: T, b: T): void => {
    if (a === b) {
        out('.')
    } else {
        console.error(`\n${a}, ${b}`);
    }
}

(() => {
    const r = parse_datetime('1225クリスマス');
    assert_equal(r.m, '12');
    assert_equal(r.d, '25');
    assert_equal(r.message_payload, 'クリスマス');
})();

(() => {
    const r = parse_datetime('１２２５クリスマス');
    assert_equal(r.m, '12');
    assert_equal(r.d, '25');
    assert_equal(r.message_payload, 'クリスマス');
})();

(() => {
    const r = parse_datetime('01 元旦');
    assert_equal(r.m, '01');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '元旦');
})();

(() => {
    const r = parse_datetime('元旦');
    assert_equal(r.m, '');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '元旦');
})();

(() => {
    const r = parse_datetime('1元旦');
    assert_equal(r.m, '');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '1元旦');
})();

out('\n');