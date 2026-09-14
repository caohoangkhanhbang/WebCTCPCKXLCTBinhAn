using Microsoft.Extensions.FileProviders;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//Thêm services
builder.Services.AddSingleton<IConnectionService, ConnectionService>();

// Class xử lý Logic dùng Scoped (sống theo từng HTTP Request rồi tự hủy giải phóng RAM)
builder.Services.AddScoped<BusinessHome>();
builder.Services.AddScoped<BusinessGioiThieu>();
builder.Services.AddScoped<BusinessDuAn>();
builder.Services.AddScoped<BusinessLinhVucHoatDong>();
builder.Services.AddScoped<BussinessLienHe>();

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
        policy => policy.WithOrigins("http://localhost:4200") // Địa chỉ Angular 
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

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
