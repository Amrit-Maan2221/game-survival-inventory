using Microsoft.AspNetCore.Mvc;
using Play.Catalog.Service.Dtos;

namespace Play.Catalog.Service.Controllers;

[ApiController]
[Route("[controller]")]
public class ItemsController : ControllerBase
{
    private static readonly List<ItemDto> items = new()
    {
        new ItemDto(Guid.NewGuid(), "Potion", "Restores small amount of HP", 5, DateTimeOffset.UtcNow),
        new ItemDto(Guid.NewGuid(), "Antidote", "Restores small amount of HP", 5, DateTimeOffset.UtcNow),
        new ItemDto(Guid.NewGuid(), "Bronze sword", "Deals a small amount of damage", 5, DateTimeOffset.UtcNow)
    };

    [HttpGet]
    public IEnumerable<ItemDto> Get()
    {
        return items;
    }

    [HttpGet("{id}")]
    public ActionResult<ItemDto> Get(Guid id)
    {
        ItemDto itemDto = items.Where(t => t.Id == id).FirstOrDefault();
        if(itemDto is null)
        {
            return NotFound();
        }
        return itemDto;
    }


    [HttpPost]
    public ActionResult<ItemDto> Post(CreateItemDto createItemDto)
    {
        ItemDto itemDto = new ItemDto(Guid.NewGuid(), createItemDto.Name, createItemDto.Description, createItemDto.Price, DateTimeOffset.UtcNow);
        items.Add(itemDto);
        return CreatedAtAction(nameof(Get), new { id = itemDto.Id }, itemDto);
    }

    [HttpPut("{id}")]
    public ActionResult Put(Guid id, UpdateItemDto updateItemDto)
    {
        ItemDto existingItemDto = items.Where(t => t.Id == id).FirstOrDefault();
        if (existingItemDto is null)
        {
            return NotFound();
        }

        ItemDto updatedItemDto = existingItemDto with
        {
            Name = updateItemDto.Name,
            Description = updateItemDto.Description,
            Price = updateItemDto.Price
        };

        int index = items.FindIndex(existingItem => existingItem.Id == id);
        items[index] = updatedItemDto;

        return NoContent();
    }


    [HttpDelete("{id}")]
    public ActionResult Delete(Guid id)
    {
        ItemDto existingItemDto = items.Where(t => t.Id == id).FirstOrDefault();
        if (existingItemDto is null)
        {
            return NotFound();
        }

        items.Remove(existingItemDto);

        return NoContent();
    }
}