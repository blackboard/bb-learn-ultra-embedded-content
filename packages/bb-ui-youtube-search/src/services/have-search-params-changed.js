export default (latestRequest, searchParams) => {
    let hasNewSearchParams = true;

    if (latestRequest) {
        hasNewSearchParams = Object.keys(searchParams)
            .some(key => !['pageNumber', 'pageToken'].includes(key) && searchParams[key] !== latestRequest[key]);
    }

    return hasNewSearchParams;
};
