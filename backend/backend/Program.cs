using System.Collections.Concurrent;

var MyAllowSpecificOrigins = "_MyAllowSubdomainPolicy";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500")
                .AllowAnyHeader().AllowAnyMethod();
        });
});
builder.Services.AddControllers();
var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);

var users = new ConcurrentDictionary<int, Users>();

app.MapPost("/users", (Users user) =>
{
    users[user.Id] = user;
    return Results.Created($"/users/{user.Id}", user);
});

app.MapGet("/users", () => 
Results.Ok(users.Values.OrderBy(x => x.Id))
);

app.MapDelete("/users/{id:int}", (int id) =>
{
    if (users.TryRemove(id, out _))
    {
        return Results.Ok($"User #{id} removida.");
    }
    else
    {
        return Results.NotFound($"User #{id} não encontrada.");
    }
});

app.MapGet("/", () => "Backend Rodando");
app.Run();
public record Users(int Id, string Nome);
