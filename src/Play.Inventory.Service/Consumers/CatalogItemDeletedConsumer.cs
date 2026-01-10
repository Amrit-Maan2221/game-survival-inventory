using MassTransit;
using Play.Catalog.Contracts;
using Play.Common;
using Play.Inventory.Service.Entities;

namespace Play.Inventory.Service.Consumers;

public class CatalogItemDeletedConsumer(IRepository<CatalogItem> repository) : IConsumer<CatalogItemDeleted>
{
    public async Task Consume(ConsumeContext<CatalogItemDeleted> context)
    {
        CatalogItemDeleted message = context.Message;
        CatalogItem? item = await repository.GetAsync(message.Id);
        if (item is not null)
        {
            await repository.DeleteAsync(message.Id);
        }
    }
}