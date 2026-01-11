using Play.Catalog.Service.Entities;
using Play.Common.MongoDB;
using Play.Common.MassTransit;
using Play.Common.Settings;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);
var isRender = builder.Configuration["IS_RENDER"] == "true";
if (isRender)
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
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

var app = builder.Build();
app.UseForwardedHeaders();

var enableSwagger = app.Environment.IsDevelopment() || builder.Configuration["ENABLE_SWAGGER"] == "true";
if (enableSwagger)
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs");
}

app.MapControllers();


app.MapGet("/", () => $"This is the Play.Catalog Service.");
// map the health check endpoint with ok status and timestamp
app.MapGet("/health", () => Results.Ok(new { status = "Ok", timestamp = DateTimeOffset.UtcNow }));


app.Run();