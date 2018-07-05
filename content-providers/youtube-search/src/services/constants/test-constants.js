const MOCK_SEARCH_PARAMS = {
    page1: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 1,
        searchText: 'Text search query',
    },
    page2: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 2,
        searchText: 'Text search query',
    },
    page3: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 3,
        searchText: 'Text search query',
    },
    page4: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 4,
        searchText: 'Text search query',
    },
    page5: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 5,
        searchText: 'Text search query',
    },
    page6: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 6,
        searchText: 'Text search query',
    },
    page7: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 7,
        searchText: 'Text search query',
    },
    page8: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 8,
        searchText: 'Text search query',
    },
    page9: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 9,
        searchText: 'Text search query',
    },
    page10: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 10,
        searchText: 'Text search query',
    },
    page11: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 11,
        searchText: 'Text search query',
    },
    page12: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 12,
        searchText: 'Text search query',
    },
    page13: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 13,
        searchText: 'Text search query',
    },
    page14: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 14,
        searchText: 'Text search query',
    },
    page15: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 15,
        searchText: 'Text search query',
    },
    page16: {
        itemsPerPage: 10,
        lastUpdated: 'pastYear',
        orderBy: 'relevance',
        pageNumber: 16,
        searchText: 'Text search query',
    },
    random: {
        itemsPerPage: 10,
        lastUpdated: 'past3Months',
        orderBy: 'relevance',
        pageNumber: 1,
        searchText: 'Text search query alt',
    },
};

const MOCK_SEARCH_RESPONSE = {
    page1: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 1,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page2: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 2,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page3: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 3,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page4: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 4,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page5: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 5,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page6: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 6,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page7: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 7,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page8: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 8,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page9: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 9,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page10: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 10,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page11: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 11,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page12: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 12,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page13: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 13,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
    page14: {
        pagination: {
            itemsPerPage: 10,
            pageNumber: 14,
            nextPageToken: 'mockTokenNext',
            prevPageToken: 'mockTokenPrev',
            totalItems: 1000,
        },
        results: [],
    },
};

export {
    MOCK_SEARCH_PARAMS,
    MOCK_SEARCH_RESPONSE,
};
