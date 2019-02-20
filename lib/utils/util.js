function isUndef(target) {
    return target === null || target === undefined;
}

function isDef(target) {
    return target !== undefined && target !== null
}

exports.isUndef = isUndef;
exports.isDef = isDef;