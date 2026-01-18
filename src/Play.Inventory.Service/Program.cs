using Play.Common.MassTransit;
using Play.Common.MongoDB;
using Play.Common.Settings;
using Play.Inventory.Service.Clients;
using Play.Inventory.Service.Entities;
using Polly;
using Polly.Timeout;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    // Log the port being used
    Console.WriteLine($"Using Environment port: {port}");
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins!)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
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
    client.BaseAddress = new Uri(builder.Configuration["CATALOG_SERVICE_URL"]  ?? "https://localhost:7009");
    }).AddTransientHttpErrorPolicy(builder => builder.Or<TimeoutRejectedException>().WaitAndRetryAsync
        (3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt) + (jitter.Next(0, 1000) / 1000.0)))
        )
        .AddTransientHttpErrorPolicy(builder => builder.Or<TimeoutRejectedException>().CircuitBreakerAsync
        (5, TimeSpan.FromSeconds(30))
    ).AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(1)));

var app = builder.Build();
app.UseForwardedHeaders();
app.UseCors("AllowFrontend");

bool enableSwagger = app.Environment.IsDevelopment() || builder.Configuration["ENABLE_SWAGGER"] == "true";
if (enableSwagger)
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs");
}

app.MapControllers();

app.MapGet("/", () => $"This is the Play.Inventory Service.");
// map the health check endpoint with ok status and timestamp
app.MapGet("/health", () => Results.Ok(new { status = "Ok", timestamp = DateTimeOffset.UtcNow }));
Console.WriteLine("App is about to Run...");
IHostApplicationLifetime lifetime = app.Lifetime;

lifetime.ApplicationStarted.Register(() =>
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("ApplicationStarted triggered");
});

lifetime.ApplicationStopping.Register(() =>
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogWarning("ApplicationStopping triggered");
});

lifetime.ApplicationStopped.Register(() =>
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogWarning("ApplicationStopped triggered");
});

app.Run();