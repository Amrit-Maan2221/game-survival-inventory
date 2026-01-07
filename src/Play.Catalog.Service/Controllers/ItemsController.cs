using Microsoft.AspNetCore.Mvc;
using Play.Catalog.Service.Dtos;
using Play.Catalog.Service.Entities;
using Play.Common;

namespace Play.Catalog.Service.Controllers;

[ApiController]
[Route("[controller]")]
public class ItemsController(IRepository<Item> itemsRepository) : ControllerBase
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

        return NoContent();
    }
}