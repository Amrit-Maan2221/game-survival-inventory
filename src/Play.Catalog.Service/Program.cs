using Play.Catalog.Service.Entities;
using Play.Common.MongoDB;
using Play.Common.MassTransit;
using Play.Common.Settings;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddControllers(options=>
{
    options.SuppressAsyncSuffixInActionNames = false;
}); 

ServiceSettings serviceSettings = builder.Configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();

builder.Services.AddMongo().AddMongoRepository<Item>("items");
builder.Services.AddMassTransitWithRabbitMq();


var app = builder.Build();
var enableSwagger = app.Environment.IsDevelopment() || builder.Configuration["ENABLE_SWAGGER"] == "true";
if (enableSwagger)
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs");
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();