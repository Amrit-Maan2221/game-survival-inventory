using MassTransit;
using Play.Catalog.Contracts;
using Play.Common;
using Play.Inventory.Service.Entities;

namespace Play.Inventory.Service.Consumers;

public class CatalogItemCreatedConsumer(IRepository<CatalogItem> repository) : IConsumer<CatalogItemCreated>
{
    public async Task Consume(ConsumeContext<CatalogItemCreated> context)
    {
        CatalogItemCreated message = context.Message;
        CatalogItem? item = await repository.GetAsync(message.Id);
        if (item is null)
        {
            await repository.CreateAsync(new CatalogItem
            {
                Id = message.Id,
                Name = message.Name,
                Description = message.Description
            });
        }
    }
}