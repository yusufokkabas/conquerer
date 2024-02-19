const Response = require("../utils/response");
const APIError = require("../utils/errors");
const config = require('config');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: config.ELASTIC_API_URL,
  auth: {
      apiKey: config.ELASTIC_API_KEY
  }
});

const categoryRates = async (req, res) => {
    try {
        const response = await client.search({
          index: 'search-posts',
          body: { // searh query
            size: 0, 
            aggs: {
              categories: {
                  terms: {
                    field: 'category.keyword' 
                  }
                }
            }
          }
        });
        const totalPosts = response.aggregations.categories.buckets.reduce((sum, bucket) => sum + bucket.doc_count, 0); //calculate total posts number
        const categoryRates = response.aggregations.categories.buckets.map(bucket => ({
          category: bucket.key,
          percentage: parseFloat(((bucket.doc_count / totalPosts) * 100).toFixed(2)) //give percentages to the user.
        }));
        return new Response(categoryRates).success(res);
      } catch (error) {
        console.error(error);
        throw new APIError(error, 400);
      }
}

const userStats = async (req, res) => {
    try {
        const totalUsers = await client.count({ index: 'search-users' }); //get total users number
        const activeUsers = await client.search({
          index: 'search-posts', //search query for active users who have at least one post
          body: {
            "size": 0,
            "aggs": {
              "active_users": {
                "cardinality": {
                  "field": "profile.username.keyword"
                }
              }
            }
          }
        });
        const response = {
          total_users: totalUsers.count,
          bloggers: activeUsers.aggregations.active_users.value,
          readers: totalUsers.count - activeUsers.aggregations.active_users.value //calculate readers
        };
        return new Response(response).success(res);
      } catch (error) {
        console.error(error);
        throw new APIError(error, 400);
      }
};
const postByTime = async (req, res) => {
    try {   
        const { year } = req.queryBuilder.filters;
        const response = await client.search({
          index: 'search-posts',
          body: {
            "size": 0,
            "query": {
                "range": {
                    "createdAt": { //search query range for posts by time
                        gte: year ? `${year}-01-01` : "now/y",
                        lte: year ? `${year}-12-31` : "now/d"
                    }
                }
            },
            "aggs": {
                "posts_this_week": {
                    "filter": {
                        "range": {
                            "createdAt": { //range for posts this week
                                "gte": year ? `${year}-12-25` : "now/w",
                                "lte": year ? `${year}-12-31` : "now/d"
                            }
                        }
                    },
                    "aggs": {
                        "days": {
                            "date_histogram": {
                                "field": "createdAt",
                                "calendar_interval": "day",
                                "format": "yyyy-MM-dd"
                            },
                            "aggs": { //aggregation for categories by day
                                "categories": {
                                    "terms": { "field": "category.keyword" }
                                }
                            }
                        }
                    }
                },
                "posts_this_month": {
                    "filter": {
                        "range": {
                            "createdAt": { //range for posts this month
                                "gte": year ? `${year}-12-01` : "now/m",
                                "lte": year ? `${year}-12-31` : "now/d"
                            }
                        }
                    },
          "aggs": {
            "weeks": {
                "date_histogram": {
                    "field": "createdAt",
                    "calendar_interval": "week",
                    "format": "yyyy-MM-dd"
                },
                "aggs": { //aggregation for categories by week
                    "categories": {
                        "terms": { "field": "category.keyword" }
                    }
                }
            }
        }
    },
    "posts_this_year": {
        "filter": {
            "range": { //range for posts this year
                "createdAt": {
                    "gte": year ? `${year}-01-01` : "now-1y/y",
                    "lte": year ? `${year}-12-31` : "now/d"
                }
            }
        },
        "aggs": {
            "months": {
                "date_histogram": {
                    "field": "createdAt",
                    "calendar_interval": "month",
                    "format": "yyyy-MM"
                },
                "aggs": { //aggregation for categories by month
                    "categories": {
                        "terms": { "field": "category.keyword" }
                    }
                }
            }
        }
    }
}
}
        });
        let posts_this_month = response.aggregations.posts_this_month.weeks.buckets.map(bucket => ({
            week: bucket.key_as_string,
            posts: bucket.doc_count,
            categories: bucket.categories.buckets.map(category => ({
                category: category.key,
                posts: category.doc_count,
            }))
        }));
        let posts_this_week = response.aggregations.posts_this_week.days.buckets.map(bucket => ({
            day: bucket.key_as_string,
            posts: bucket.doc_count,
            categories: bucket.categories.buckets.map(category => ({
                category: category.key,
                posts: category.doc_count,
            }))
        }));
        let posts_this_year = response.aggregations.posts_this_year.months.buckets.map(bucket => ({
        month: bucket.key_as_string,
        posts: bucket.doc_count,
        categories: bucket.categories.buckets.map(category => ({
            category: category.key,
            posts: category.doc_count,
        }))
        }));
        const result = {
            posts_this_week,
            posts_this_month,
            posts_this_year
        };
        return new Response(result).success(res);
      } catch (error) {
        console.error(error);
        throw new APIError(error, 400);
      }
};


module.exports = {
  categoryRates,
  userStats,
  postByTime
};