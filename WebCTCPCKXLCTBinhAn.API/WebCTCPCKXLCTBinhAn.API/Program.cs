using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
//Cấu hình xác thực
using System.Text;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.Services;
//hết cấu hình xác thực

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//Thêm services cho connectionString cách 1
builder.Services.AddSingleton<IConnectionService, ConnectionService>();

// Thêm services cho connectionString cách 2 hiện đại và tiện hơn
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Chưa cấu hình DefaultConnection");
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
var dataSource = dataSourceBuilder.Build();
builder.Services.AddSingleton(dataSource);

// Class xử lý Logic dùng Scoped (sống theo từng HTTP Request rồi tự hủy giải phóng RAM)
builder.Services.AddScoped<BusinessHome>();
builder.Services.AddScoped<BusinessGioiThieu>();
builder.Services.AddScoped<BusinessDuAn>();
builder.Services.AddScoped<BusinessLinhVucHoatDong>();
builder.Services.AddScoped<BussinessLienHe>();
builder.Services.AddScoped<BusinessTuyenDung>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICacCotMocRepository, CacCotMocRepository>();
builder.Services.AddScoped<IManipulationDB, ManipulationDB>();

//1. Dòng này giúp giữ nguyên tên thuộc tính (Property) của class như lúc khai báo để truyền api
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

//1. Cho phép truy cập từ Angular Client bằng cách sử dụng CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient",
        policy => policy.WithOrigins("http://localhost:4200", "http://localhost:4201") // Địa chỉ Angular 
                        .AllowAnyMethod()                     // Cho phép GET, POST, PUT, DELETE...
                        .AllowAnyHeader());                    // Cho phép các Header gửi lên
});

//1. Cấu hình thư mục lưu ảnh tải lên bên ngoài thư mục chứa code 
var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "uploads-folder");

//1. Tự động tạo thư mục nếu chưa tồn tại
if (!Directory.Exists(uploadsFolderPath))
{
    Directory.CreateDirectory(uploadsFolderPath);
}

//Cấu hình đăng nhập
var jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "Jwt:Key chưa được cấu hình"
    );

var jwtIssuer =
    builder.Configuration["Jwt:Issuer"];

var jwtAudience =
    builder.Configuration["Jwt:Audience"];


builder.Services
    .AddAuthentication(
        JwtBearerDefaults
            .AuthenticationScheme
    )
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,

                ValidateAudience = true,

                ValidateLifetime = true,

                ValidateIssuerSigningKey =
                    true,

                ValidIssuer =
                    jwtIssuer,

                ValidAudience =
                    jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8
                            .GetBytes(jwtKey)
                    ),

                ClockSkew =
                    TimeSpan.Zero
            };
    });


builder.Services
    .AddAuthorization();
//Hết cấu hình đăng nhập

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//2. Cho phép truy cập từ Angular Client bằng cách sử dụng CORS
app.UseCors("AllowAngularClient");
//1.Cho phép truy cập vào thư mục wwwroot để phục vụ các tệp tĩnh (như hình ảnh, CSS, JS)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsFolderPath),
    RequestPath = "/cdn" // Client sẽ truy cập qua URL: https://your-domain.com/cdn/my-image.jpg
});

app.Run();
