using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DataAccess
{
    public class ApiDbContextFactory : IDesignTimeDbContextFactory<QuizDbContext>
    {
        public QuizDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<QuizDbContext>();
            // Load the configuration from your appsettings or environment variables
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json") // Or any other configuration file
                .Build();

            var connectionString = config.GetConnectionString("DefaultConnection");

            optionsBuilder.UseNpgsql(connectionString);

            return new QuizDbContext(optionsBuilder.Options);
        }
    }
}