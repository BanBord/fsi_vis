function arrayalgo(length) {
    let numbers = [];
    let result = length - 1;
    let currentNumber = 2;

    while (result > 0) {
        if (result > 10) {
            numbers.push(currentNumber);
            result -= currentNumber;
            currentNumber = (currentNumber % 10) + 1;
            if (currentNumber === 1) currentNumber = 2;
        } else {
            numbers.push(result);
            result = 0;
        }
    }

    numbers.unshift(1); // Add 1 to the beginning of the array
    return numbers;
}
