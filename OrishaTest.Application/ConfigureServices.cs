
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace OrishaTest.Application
{
public static class ConfigureServices
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            //Configuration of Mediator
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly( Assembly.GetExecutingAssembly()));
            //Configuration of AutoMapper
             services.AddAutoMapper(Assembly.GetExecutingAssembly());
            //Configuration of Validator
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            return services;
        }
    }
}
