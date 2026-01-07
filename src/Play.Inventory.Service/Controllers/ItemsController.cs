using Microsoft.AspNetCore.Mvc;
using Play.Common;
using Play.Inventory.Service.Clients;
using Play.Inventory.Service.Dtos;
using Play.Inventory.Service.Entities;

namespace Play.Inventory.Service.Controllers;

[ApiController]
[Route("[controller]")]
public class ItemsController(IRepository<InventoryItem> itemsRepository, CatalogClient catalogClient) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetAsync(Guid userId)
    {
        if(userId == Guid.Empty)
        {
            return BadRequest();
        }
        IReadOnlyCollection<CatalogItemDto> catalogItems = await catalogClient.GetCatalogItemsAsync();
        IReadOnlyCollection<InventoryItem> items = await itemsRepository.GetAllAsync(item => item.UserId == userId);

        var itemsDtos = items.Select(item =>
        {
            var catalogItem = catalogItems.First(catalogItem => catalogItem.Id == item.CatalogItemId);
            return item.AsDto(catalogItem.Name, catalogItem.Description);
        });

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult> PostAsync(GrantItemsDto grantItemsDto)
    {
        var inventoryItem = await itemsRepository.GetAsync(item => item.UserId == grantItemsDto.UserId && item.CatalogItemId == grantItemsDto.CatalogItemId);

        if (inventoryItem is null)
        {
            inventoryItem = new InventoryItem
            (
                grantItemsDto.UserId,
                grantItemsDto.CatalogItemId,
                grantItemsDto.Quantity,
                DateTimeOffset.UtcNow.DateTime
            );

            await itemsRepository.CreateAsync(inventoryItem);
        }
        else
        {
            inventoryItem.Quantity += grantItemsDto.Quantity;
            await itemsRepository.UpdateAsync(inventoryItem);
        }

        return Ok();
    }
}