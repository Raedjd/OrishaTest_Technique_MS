# Voir https://aka.ms/customizecontainer pour personnaliser le conteneur de débogage.

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["OrishaTest.Api/OrishaTest.Api.csproj", "OrishaTest.Api/"]
COPY ["OrishaTest.Application/OrishaTest.Application.csproj", "OrishaTest.Application/"]
COPY ["OrishaTest.Domain/OrishaTest.Domain.csproj", "OrishaTest.Domain/"]
COPY ["OrishaTest.Infrastructure/OrishaTest.Infrastructure.csproj", "OrishaTest.Infrastructure/"]
RUN dotnet restore "./OrishaTest.Api/OrishaTest.Api.csproj"
COPY . .
WORKDIR "/src/OrishaTest.Api"
RUN dotnet build "./OrishaTest.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./OrishaTest.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OrishaTest.Api.dll"]
