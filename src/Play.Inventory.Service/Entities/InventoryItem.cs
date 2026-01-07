using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Play.Common;

namespace Play.Inventory.Service.Entities;

public class InventoryItem : IEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CatalogItemId { get; set; }
    public int Quantity { get; set; }
    public DateTime AcquiredDate { get; set; }

    public InventoryItem()
    {
    }

    public InventoryItem(Guid userId, Guid catalogItemId, int quantity, DateTime acquiredDate)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        CatalogItemId = catalogItemId;
        Quantity = quantity;
        AcquiredDate = acquiredDate;
    }
}