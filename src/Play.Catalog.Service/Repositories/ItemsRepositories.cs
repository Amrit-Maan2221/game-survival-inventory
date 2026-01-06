using MongoDB.Driver;
using Play.Catalog.Service.Entities;

namespace Play.Catalog.Service.Repositories;

public class ItemsRepository : IItemsRepository
{
    private const string collectionName = "items";
    private readonly IMongoCollection<Item> itemsCollection;
    private readonly FilterDefinitionBuilder<Item> filterBuilder = Builders<Item>.Filter;

    public ItemsRepository(IMongoDatabase database)
    {
        itemsCollection = database.GetCollection<Item>(collectionName);
    }

    public async Task<IReadOnlyCollection<Item>> GetItemsAsync()
    {
        return await itemsCollection.Find(filterBuilder.Empty).ToListAsync();
    }

    public async Task<Item> GetItemAsync(Guid id)
    {
        FilterDefinition<Item> filter = filterBuilder.Eq(item => item.Id, id);
        return await itemsCollection.Find(filter).SingleOrDefaultAsync();
    }

    public async Task CreateItemAsync(Item item)
    {
        if (item is null)
        {
            throw new ArgumentNullException(nameof(item));
        }
        await itemsCollection.InsertOneAsync(item);
    }

    public async Task UpdateItemAsync(Item item)
    {
        if (item is null)
        {
            throw new ArgumentNullException(nameof(item));
        }

        FilterDefinition<Item> filter = filterBuilder.Eq(existingItem => existingItem.Id, item.Id);
        await itemsCollection.ReplaceOneAsync(filter, item);
    }

    public async Task DeleteItemAsync(Guid id)
    {
        FilterDefinition<Item> filter = filterBuilder.Eq(item => item.Id, id);
        await itemsCollection.DeleteOneAsync(filter);
    }
}
