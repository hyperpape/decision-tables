const ANY = Symbol();

function is_sound(table, states, ordinal_fn) {
    const expanded = expand(table, states, ordinal_fn);
    for (let i = 0; i < expanded.length - 1; i++) {
        const l = expanded[i];
        const r = expanded[i + 1];
        if (same_condition(l, r)) {
            if (l[l.length - 1] !== r[r.length - 1]) {
                return false;
            }
        }
    }
    return true;
}

function is_complete(table, states, ordinal_fn) {
    // YOLO: error checking
    const colCount = table[0].length - 1;
    const expanded = expand(table, states, ordinal_fn);
    const expected_size = Math.pow(states.length - 1, colCount);
    if (expanded.length < expected_size) {
        return false;
    }
    return distinct_rows(expanded) === expected_size;
}

function expand(table, states, ordinal_fn) {
    const rows = [];
    const stack = [];
    for (let i = 0; i < table.length; i++) {
        stack.push(table[i]);
    }
    while (stack.length > 0) {
        const row = stack.pop();
        if (!row_needs_expansion(stack, states, row)) {
            rows.push(row);
        }
    }
    return sort_table(rows, states, ordinal_fn);
}

function row_needs_expansion(stack, states, row) {
    for (let i = 0; i < row.length; i++) {
        const condition = row[i];
        if (condition === ANY) {
            for (let k = 0; k < states.length; k++) {
                if (states[k] !== ANY) {
                    const sliced = row.slice();
                    sliced[i] = states[k];
                    stack.push(sliced);
                }
            }
            return true;
        }
    }
    return false;
}
        
// assume sorted
function distinct_rows(table) {
    if (table.length === 0) {
        return 0;
    }
    let total = 1;
    for (let i = 0; i < table.length - 1; i++) {
        const l = table[i];
        const r = table[i + 1];
        if (!same_condition(l, r)) {
            total++;
        }
    }
    return total;
}

function same_condition(row1, row2) {
    for (let i = 0; i < row1.length - 1; i++) {
        if (row1[i] !== row2[i]) {
            return false;
        }
    }
    return true;
}
    
function sort_table(table, states, fn) {
    if (!fn) {
        fn = state_ordinal;
    }
    table.sort((x, y) => {
        for (let i = 0; i < x.length; i++) {
            const cmp = fn(x[i], states) - fn(y[i], states);
            if (cmp != 0) {
                return cmp;
            }
        }
        return 0;
    });
    return table;
}

function state_ordinal(state, states) {
    return states.indexOf(state);
}


// Tests

const boolean_states = [true, false, ANY];

const small_table = [
    [ true, 1],
    [ false, 2]
];

const medium_table = [
    [ true, true, true, 0],
    [ true, true, false, 1],
    [ false, true, true, 0],
    [ false, true, false, 3],
    [ false, false, ANY, 2],
    [ true, false, true, 4],
    [ true, false, false, 5]
];

const incomplete = [
    [ true, true, true, 0],
    [ false, false, ANY, 2],
    [ true, false, false, 5]
];

const unsound = [
    [ true, 1],
    [ false, 1],
    [ true, 2]
];

console.log("True tests coming up");
console.log(is_sound(small_table, boolean_states));
console.log(is_complete(small_table, boolean_states));

console.log(is_sound(medium_table, boolean_states));
console.log(is_complete(medium_table, boolean_states));

console.log("Now false");
console.log(is_sound(unsound, boolean_states));
console.log(is_complete(incomplete, boolean_states));

const non_bool_table = [
    [ 1, 2, 5],
    [ 2, 3, 4],
    [ 1, 2, 3] 
];

const non_bool_sound_complete = [
    [1, 2, 3],
    [1, 3, 5],
    [1, 1, 4],
    [2, ANY, 1],
    [3, 1, 2],
    [3, 2, 3],
    [3, 3, 4]
]

console.log(is_sound(non_bool_table, [1, 2, 3, ANY]));
console.log(is_complete(non_bool_table, [1, 2, 3, ANY]));

console.log("Now true again");
console.log(is_sound(non_bool_sound_complete, [1, 2, 3, ANY]));
console.log(is_complete(non_bool_sound_complete, [1, 2, 3, ANY]));
