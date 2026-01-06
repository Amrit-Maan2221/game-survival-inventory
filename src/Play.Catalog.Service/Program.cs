using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using Play.Catalog.Service.Entities;
using Play.Catalog.Service.Repositories;
using Play.Catalog.Service.Settings;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

ServiceSettings serviceSettings = builder.Configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();

BsonSerializer.RegisterSerializer(new DateTimeOffsetSerializer(BsonType.String));
builder.Services.AddOpenApi();
builder.Services.AddControllers(options=>
{
    options.SuppressAsyncSuffixInActionNames = false;
}); 

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    MongoDbSettings mongoDbSettings = builder.Configuration.GetSection(nameof(MongoDbSettings)).Get<MongoDbSettings>();
    MongoClient mongoClient = new MongoClient(mongoDbSettings.ConnectionString);
    return mongoClient.GetDatabase(serviceSettings.ServiceName);
});


builder.Services.AddSingleton<IRepository<Item>>(sp=>
{
    IMongoDatabase database = sp.GetRequiredService<IMongoDatabase>();
    return new MongoRepository<Item>(database, "items");
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();