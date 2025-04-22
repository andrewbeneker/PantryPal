using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PantryPalAPI;
using PantryPalAPI.Entities;
using PantryPalAPI.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddDbContext<PantryPalDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add configuration binding for Edamam & Spoonacular settings
builder.Services.Configure<EdamamSettings>(builder.Configuration.GetSection("Edamam"));
builder.Services.Configure<SpoonacularSettings>(builder.Configuration.GetSection("Spoonacular"));
// Register HttpClient for API calls
builder.Services.AddHttpClient<IEdamamService, EdamamService>();
builder.Services.AddHttpClient<ISpoonacularService, SpoonacularService>();
// Register EdamamService
builder.Services.AddScoped<IEdamamService, EdamamService>();
builder.Services.AddScoped<ISpoonacularService, SpoonacularService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        //Deployed URL: "https://pantrypal-ui-ajhgbqewhmcxb5ch.centralus-01.azurewebsites.net"
        //LocalHost URL: "http://localhost:4200"

        policy.WithOrigins("https://pantrypal-ui-ajhgbqewhmcxb5ch.centralus-01.azurewebsites.net",
            "http://localhost:4200",
            "http://localhost:3000") // or your deployed frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

var app = builder.Build();

app.UseCors("CorsPolicy");

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
