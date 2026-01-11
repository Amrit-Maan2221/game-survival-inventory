using Play.Catalog.Service.Entities;
using Play.Common.MongoDB;
using Play.Common.MassTransit;
using Play.Common.Settings;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    // Log the port being used
    Console.WriteLine($"Using Environment port: {port}");
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

   


builder.Services.AddOpenApi();
builder.Services.AddControllers(options=>
{
    options.SuppressAsyncSuffixInActionNames = false;
}); 

ServiceSettings serviceSettings = builder.Configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();

builder.Services.AddMongo().AddMongoRepository<Item>("items");
builder.Services.AddMassTransitWithRabbitMq();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

WebApplication app = builder.Build();
app.UseForwardedHeaders();

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