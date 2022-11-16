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

function lerpColor(start, end, time) {
    return {
        r: lerp(start.r, end.r, time),
        g: lerp(start.g, end.g, time),
        b: lerp(start.b, end.b, time),
    }
}


function lerp(start, end, time) {
    return (1 - time) * start + time * end;
}
