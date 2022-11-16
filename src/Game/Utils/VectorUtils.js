function magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}

function normalize(x, y) {
    const m = magnitude(x, y);
    return {
        x: x / m,
        y: y / m
    };
}

function direction(x1, y1, x2, y2) {
    return normalize(x1 - x2, y1 - y2);
}

function distance(x1, y1, x2, y2) {
    return magnitude(x1 - x2, y1 - y2);
}

function multiplyVec(object, x, y) {
    return {
        x: object.x * x,
        y: object.y * y
    }
}
