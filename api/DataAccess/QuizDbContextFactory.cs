using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DataAccess
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<QuizDbContext>
    {
        public QuizDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<QuizDbContext>();

            // Set up configuration to read from appsettings.Development.json
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())  // Path where the app is running
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            // Use configuration to set up the connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            optionsBuilder.UseNpgsql(connectionString);

            return new QuizDbContext(optionsBuilder.Options);
        }
    }
}