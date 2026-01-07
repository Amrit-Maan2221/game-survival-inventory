using Play.Inventory.Service.Dtos;

namespace Play.Inventory.Service;


public static class Extensions
{
    public static InventoryItemDto AsDto(this Entities.InventoryItem inventoryItem, string name, string description)
    {
        return new InventoryItemDto(inventoryItem.CatalogItemId, inventoryItem.Quantity, name, description,inventoryItem.AcquiredDate);
    }
}