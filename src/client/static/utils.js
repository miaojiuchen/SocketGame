window.$ = function (id) {
    if (id && typeof id === 'string')
        return document.getElementById(id);
    else
        throw new Error('Error params for selector function');
}