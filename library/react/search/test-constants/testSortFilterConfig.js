const TEST_SORT_FILTER_CONFIG = [{
    name: 'orderBy',
    defaultSelectedValue: 'relevance',
    options: [{
        value: 'date',
        text: 'search.options.sortByDate',
    }, {
        value: 'rating',
        text: 'search.options.sortByRating',
    }, {
        value: 'relevance',
        text: 'search.options.sortByRelevance',
    }, {
        value: 'title',
        text: 'search.options.sortByTitle',
    }, {
        value: 'viewCount',
        text: 'search.options.sortByViewCount',
    }],
},
{
    name: 'lastUpdated',
    options: [{
        value: 'anyTime',
        text: 'search.options.updatedAnytime',
    }, {
        value: 'pastYear',
        text: 'search.options.updatedPastYear',
    }, {
        value: 'past3Months',
        text: 'search.options.updatedPast3Months',
    }],
}];

export default TEST_SORT_FILTER_CONFIG;
