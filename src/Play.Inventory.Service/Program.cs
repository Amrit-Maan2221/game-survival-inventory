using Play.Catalog.Service.Repositories;
using Play.Common.Settings;
using Play.Inventory.Service.Clients;
using Play.Inventory.Service.Entities;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddControllers(options=>
{
    options.SuppressAsyncSuffixInActionNames = false;
}); 

builder.Services.AddMongo().AddMongoRepository<InventoryItem>("items");
builder.Services.AddHttpClient<CatalogClient>((client) =>
{
    var catalogServiceSettings = builder.Configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();
    client.BaseAddress = new Uri("https://localhost:7009");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();