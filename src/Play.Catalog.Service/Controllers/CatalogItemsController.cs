using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Play.Catalog.Contracts;
using Play.Catalog.Service.Dtos;
using Play.Catalog.Service.Entities;
using Play.Common;

namespace Play.Catalog.Service.Controllers;

[ApiController]
[Route("[controller]")]
public class CatalogItemsController(IRepository<Item> itemsRepository, IPublishEndpoint publishEndpoint) : ControllerBase
{
    
    [HttpGet]
    public async Task<IEnumerable<ItemDto>> GetAsync()
    {
        IEnumerable<ItemDto> items = (await itemsRepository.GetAllAsync()).Select(item => item.AsDto());
        return items;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ItemDto>> GetAsync(Guid id)
    {
        ItemDto itemDto = (await itemsRepository.GetAsync(id))?.AsDto();
        if(itemDto is null)
        {
            return NotFound();
        }
        return itemDto;
    }


    [HttpPost]
    public async Task<ActionResult<ItemDto>> PostAsync(CreateItemDto createItemDto)
    {
        Item item = new()
        {
            Id = Guid.NewGuid(),
            Name = createItemDto.Name,
            Description = createItemDto.Description,
            Price = createItemDto.Price,
            CreatedDate = DateTimeOffset.UtcNow
        };

        await itemsRepository.CreateAsync(item);
        await publishEndpoint.Publish(new CatalogItemCreated(item.Id, item.Name, item.Description));
        return CreatedAtAction(nameof(GetAsync), new { id = item.Id }, item.AsDto());
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> PutAsync(Guid id, UpdateItemDto updateItemDto)
    {
        Item existingItem = await itemsRepository.GetAsync(id);
        if (existingItem is null)
        {
            return NotFound();
        }
        
        // Update the item's properties
        existingItem.Name = updateItemDto.Name;
        existingItem.Description = updateItemDto.Description;
        existingItem.Price = updateItemDto.Price;
        await itemsRepository.UpdateAsync(existingItem);
        await publishEndpoint.Publish(new CatalogItemUpdated(existingItem.Id, existingItem.Name, existingItem.Description));

        return NoContent();
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAsync(Guid id)
    {
        Item existingItem = await itemsRepository.GetAsync(id);
        if (existingItem is null)
        {
            return NotFound();
        }

        await itemsRepository.DeleteAsync(existingItem.Id);
        await publishEndpoint.Publish(new CatalogItemDeleted(existingItem.Id));

        return NoContent();
    }
}