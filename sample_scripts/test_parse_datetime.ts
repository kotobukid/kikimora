import {parse_datetime, to_channel_name} from "./parse_datetime";

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

declare type ParsedMessage = {
    m: string,
    d: string,
    message_payload: string
}


(() => {
    const r = parse_datetime('1225クリスマス');
    assert_equal(r.m, '12');
    assert_equal(r.d, '25');
    assert_equal(r.message_payload, 'クリスマス');
    console.log(to_channel_name(r));
})();

(() => {
    const r = parse_datetime('１２２５クリスマス');
    assert_equal(r.m, '12');
    assert_equal(r.d, '25');
    assert_equal(r.message_payload, 'クリスマス');
    console.log(to_channel_name(r));
})();

(() => {
    const r = parse_datetime('01 元旦');
    assert_equal(r.m, '01');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '元旦');
    console.log(to_channel_name(r));
})();

(() => {
    const r = parse_datetime('元旦');
    assert_equal(r.m, '');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '元旦');
    console.log(to_channel_name(r));
})();

(() => {
    const r = parse_datetime('8盆');
    assert_equal(r.m, '');
    assert_equal(r.d, '');
    assert_equal(r.message_payload, '8盆');
    console.log(to_channel_name(r));
})();

out('\n');