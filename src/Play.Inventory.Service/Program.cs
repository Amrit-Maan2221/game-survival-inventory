using Play.Common.MassTransit;
using Play.Common.MongoDB;
using Play.Common.Settings;
using Play.Inventory.Service.Clients;
using Play.Inventory.Service.Entities;
using Polly;
using Polly.Timeout;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = false;
});

builder.Services.AddMongo().AddMongoRepository<InventoryItem>("inventoryitems")
.AddMongoRepository<CatalogItem>("catalogitems").AddMassTransitWithRabbitMq();

Random jitter = new();
builder.Services.AddHttpClient<CatalogClient>((client) =>
{
    var catalogServiceSettings = builder.Configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();
    client.BaseAddress = new Uri("https://localhost:7009");
}).AddTransientHttpErrorPolicy(builder => builder.Or<TimeoutRejectedException>().WaitAndRetryAsync
        (3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt) + (jitter.Next(0, 1000) / 1000.0)))
        )
        .AddTransientHttpErrorPolicy(builder => builder.Or<TimeoutRejectedException>().CircuitBreakerAsync
        (5, TimeSpan.FromSeconds(30))
    ).AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(1)));

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