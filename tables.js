const ANY = Symbol();
const T = Symbol();
const F = Symbol();

const boolean_states = [T, F];

const complete_table = [
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


function is_complete(table, states) {
    // YOLO: error checking
    const colCount = table[0].length - 1;
    const expanded = expand(table, states);
    if (expanded.length < Math.pow(states.length, colCount)) {
	return false;
    }
    return (distinct_rows(expanded) === Math.pow(states.length, colCount));
}

function expand(table, states) {
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
    return sort_table(rows, states);
}

function row_needs_expansion(stack, states, row) {
    for (let i = 0; i < row.length; i++) {
	const condition = row[i];
	if (condition === ANY) {
	    for (let k = 0; k < states.length; k++) {
		const sliced = row.slice();
		sliced[i] = states[k];
		stack.push(sliced);
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
	if (!same_row(l, r)) {
	    total++;
	}
    }
    return total;
}

function same_row(row1, row2) {
    for (let i = 0; i < row1.length; i++) {
	if (row1[i] !== row2[i]) {
	    return false;
	}
    }
    return true;
}
    
function sort_table(table, states) {
    table.sort((x, y) => {
	for (let i = 0; i < x.length; i++) {
	    const cmp = state_ordinal(x[i], states) - state_ordinal(y[i], states);
	    if (cmp != 0) {
		return cmp;
	    }
	}
	return 0;
    });
    return table;
}

function state_ordinal(state, states) {
    if (state === true) {
	return 0;
    }
    else if (state === ANY) {
	return 1;
    }
    else if (state === false) {
	return 2;
    }
}

