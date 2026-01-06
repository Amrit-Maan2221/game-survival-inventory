using MongoDB.Driver;
using Play.Catalog.Service.Entities;

namespace Play.Catalog.Service.Repositories;

public class MongoRepository<T> : IRepository<T> where T : IEntity
{
    private readonly IMongoCollection<T> collection;
    private readonly FilterDefinitionBuilder<T> filterBuilder = Builders<T>.Filter;
    public MongoRepository(IMongoDatabase database, string collectionName)
    {
        collection = database.GetCollection<T>(collectionName);
    }

    public async Task<IReadOnlyCollection<T>> GetItemsAsync()
    {
        return await collection.Find(filterBuilder.Empty).ToListAsync();
    }

    public async Task<T> GetItemAsync(Guid id)
    {
        FilterDefinition<T> filter = filterBuilder.Eq(item => item.Id, id);
        return await collection.Find(filter).SingleOrDefaultAsync();
    }

    public async Task CreateItemAsync(T item)
    {
        if (item is null)
        {
            throw new ArgumentNullException(nameof(item));
        }
        await collection.InsertOneAsync(item);
    }

    public async Task UpdateItemAsync(T item)
    {
        if (item is null)
        {
            throw new ArgumentNullException(nameof(item));
        }

        FilterDefinition<T> filter = filterBuilder.Eq(existingItem => existingItem.Id, item.Id);
        await collection.ReplaceOneAsync(filter, item);
    }

    public async Task DeleteItemAsync(Guid id)
    {
        FilterDefinition<T> filter = filterBuilder.Eq(item => item.Id, id);
        await collection.DeleteOneAsync(filter);
    }
}
