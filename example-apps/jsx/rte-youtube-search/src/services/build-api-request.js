const removeEmptyParams = (params) => {
    const modifiedParams = params;
    Object.keys(modifiedParams).forEach((key) => {
        if (!modifiedParams[key] || modifiedParams[key] === 'undefined') {
            delete modifiedParams[key];
        }
    });
    return modifiedParams;
};

export default (requestMethod, path, params) =>
    gapi.client.youtube.search.list(removeEmptyParams(params)); // eslint-disable-line no-undef
