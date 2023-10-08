export class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
  pagination = () => {
    let page = this.queryData.page;
    let size = this.queryData.size;
    if (page <= 0 || !page) page = 1;
    if (size <= 0 || !size) size = 3;
    const skip = size * (page - 1);
    this.mongooseQuery.skip(parseInt(skip)).limit(parseInt(size));
    return this;
  };

  filter = () => {
    const excluded = ["sort", "page", "size", "fields", "searchKey"];
    let queryFields = { ...this.queryData };
    excluded.forEach((ele) => {
      delete queryFields[ele];
    });
    queryFields = JSON.stringify(queryFields).replace(
      /lte|lt|gte|gt|in|nin|eq|neq/g,
      (match) => {
        return `$${match}`;
      }
    );
    queryFields = JSON.parse(queryFields);
    this.mongooseQuery.find(queryFields);
    return this;
  };
  sort = () => {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(/,/g, " "));
    return this;
  };
  search = () => {
    if (this.queryData.searchKey) {
      this.mongooseQuery.find({
        $or: [
          { content: { $regex: this.queryData.searchKey , $options: 'i'} },
          { replyBody: { $regex: this.queryData.searchKey , $options: 'i' } },
          { commentBody: { $regex: this.queryData.searchKey , $options: 'i' } },
        ],
      });
    }
    return this;
  };

  select = () => {
    this.mongooseQuery.select(this.queryData.fields?.replace(/,/g, " "));
    return this;
  };
}
