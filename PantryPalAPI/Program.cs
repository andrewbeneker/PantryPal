using Microsoft.EntityFrameworkCore;
using PantryPalAPI;
using PantryPalAPI.Entities;
using PantryPalAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<PantryPalDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add configuration binding for Edamam settings
builder.Services.Configure<EdamamSettings>(builder.Configuration.GetSection("Edamam"));

// Register HttpClient for API calls
builder.Services.AddHttpClient<IEdamamService, EdamamService>();

// Register EdamamService
builder.Services.AddScoped<IEdamamService, EdamamService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
