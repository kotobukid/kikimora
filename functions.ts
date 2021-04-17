const get_payload = (s: string) => {
    const _s: string = s.replace(/　/ig, ' ');
    const tokens = _s.split(' ');
    let order: string = '';
    let payload: string = '';

    if (tokens.length > 1) {
        order = (tokens.shift() || '');
        payload = (tokens.join(' '));
    } else {
        order = (tokens.shift() || '');
        payload = '';
    }

    return {order, payload};
}

export {
    get_payload
}