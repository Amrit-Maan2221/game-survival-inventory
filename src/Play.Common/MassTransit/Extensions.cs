using System.Reflection;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Play.Common.Settings;

namespace Play.Common.MassTransit;

public static class Extensions
{
    public static IServiceCollection AddMassTransitWithRabbitMq(this IServiceCollection services)
    {
        
        services.AddMassTransit(configure =>
        {
            configure.AddConsumers(Assembly.GetEntryAssembly());
            configure.UsingRabbitMq((context, cfg) =>
            {
                var logger = context.GetRequiredService<ILoggerFactory>().CreateLogger("MassTransit");
                
                IConfiguration configuration = context.GetRequiredService<IConfiguration>();
                ServiceSettings serviceSettings = configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();
                RabbitMqSettings rabbitMqSettings = configuration.GetSection(nameof(RabbitMqSettings)).Get<RabbitMqSettings>();
                // todo log the connection string so that we can debug connection issues
                logger.LogInformation("MassTransit connecting to RabbitMQ: {ConnectionString}", rabbitMqSettings.ConnectionString);

                cfg.Host(new Uri(rabbitMqSettings.ConnectionString));
                cfg.ConfigureEndpoints(context, new KebabCaseEndpointNameFormatter(serviceSettings.ServiceName, false));
                cfg.UseMessageRetry(retryConfiguratory => retryConfiguratory.Interval(3, TimeSpan.FromSeconds(5)));
            });
        });

        return services;
    }
}