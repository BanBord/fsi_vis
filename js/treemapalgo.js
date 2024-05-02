function split(number, sections, min) {
    const ary = [];
    i = 0;
    while (number >= 0) {
        if (!ary[i % sections]) ary[i % sections] = 0;
        if (number >= min) {
            number -= min;
            ary[i % sections] += min;
            min++;
        } else {
            ary[i % sections] += number;
            break;
        }
        // Randomize here
        if (i > sections) {
            i += Math.floor(Math.random() * 7);
        } else {
            i++;
        }
    }
    return ary;
}

console.log("split", split(40, 7, 4));