using Microsoft.AspNetCore.Mvc;
using Play.Common;
using Play.Inventory.Service.Clients;
using Play.Inventory.Service.Dtos;
using Play.Inventory.Service.Entities;

namespace Play.Inventory.Service.Controllers;

[ApiController]
[Route("[controller]")]
public class InventoryItemsController(IRepository<InventoryItem> itemsRepository, IRepository<CatalogItem> catalogItemsRepository) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetAsync(Guid userId)
    {
        if(userId == Guid.Empty)
        {
            return BadRequest();
        }
        IReadOnlyCollection<InventoryItem> items = await itemsRepository.GetAllAsync(item => item.UserId == userId);
        var catalogItems = await catalogItemsRepository.GetAllAsync();

        var itemsDtos = items.Select(async item =>
        {
            var catalogItem = catalogItems.First(catalogItem => catalogItem.Id == item.CatalogItemId);
            return item.AsDto(catalogItem.Name, catalogItem.Description);
        });

        return Ok(itemsDtos);
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