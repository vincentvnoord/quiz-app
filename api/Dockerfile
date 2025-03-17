# Stage 1: Get aspnet runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Stage 2: Get dotnet sdk image for build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

COPY ["QuizAppApi.sln", "./"]
COPY ["Api/Api.csproj", "Api/"]
COPY ["Business/Business.csproj", "Business/"]
COPY ["DataAccess/DataAccess.csproj", "DataAccess/"]
COPY ["UnitTests/UnitTests.csproj", "UnitTests/"]

# Restore NuGet packages for solution
RUN dotnet restore "QuizAppApi.sln"

# Now copy the remaining application code
COPY . .
WORKDIR "/src/Api"
RUN dotnet build "Api.csproj" -c Release -o /app/build

# Stage 3: Publish the application
FROM build AS publish
RUN dotnet publish "Api.csproj" -c Release -o /app/publish

# Stage 4: Copy the published application and run it
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]