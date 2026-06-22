using System.Security.Claims;
using Npgsql;

namespace Backend_BDII.Common.Database;
//Esta clase contiene la lógica de permitir la conexión entre el Backend con la base de datos en PostgreSql
public sealed class RoleBasedNpgsqlConnectionFactory : IDbConnectionFactory, IDisposable
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly Dictionary<string, NpgsqlDataSource> _dataSources;

    public RoleBasedNpgsqlConnectionFactory(
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;

        _dataSources = new Dictionary<string, NpgsqlDataSource>
        {
            ["Unlogged"] = CreateDataSource(configuration, "UnloggedConnection"),
            ["General"] = CreateDataSource(configuration, "GeneralConnection"),
            ["Funcionario"] = CreateDataSource(configuration, "FuncionarioConnection"),
            ["Admin"] = CreateDataSource(configuration, "AdminConnection"),
            ["App"] = CreateDataSource(configuration, "AppConnection")
        };
    }

    public async Task<NpgsqlConnection> OpenConnectionAsync(CancellationToken cancellationToken = default)
    {
        var role = GetCurrentDatabaseRole();

        if (!_dataSources.TryGetValue(role, out var dataSource))
            dataSource = _dataSources["App"];

        var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        await SetApplicationContextAsync(connection, cancellationToken);
        return connection;
    }
    
    private async Task SetApplicationContextAsync(NpgsqlConnection connection, CancellationToken cancellationToken)
    {
        var email = _httpContextAccessor.HttpContext?.User
            ?.FindFirstValue(ClaimTypes.Email)
            ?.Trim()
            .ToLowerInvariant() ?? string.Empty;

        await using var command = new NpgsqlCommand(
            "SELECT set_config('app.current_email', @email, false);",
            connection);

        command.Parameters.AddWithValue("email", email);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    private string GetCurrentDatabaseRole()
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user?.Identity?.IsAuthenticated != true)
            return "Unlogged";

        if (user.IsInRole("Admin"))
            return "Admin";

        if (user.IsInRole("Funcionario"))
            return "Funcionario";

        if (user.IsInRole("General"))
            return "General";

        return "App";
    }

    private static NpgsqlDataSource CreateDataSource(IConfiguration configuration, string connectionName)
    {
        var connectionString = configuration.GetConnectionString(connectionName);

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException($"No se encontró la connection string '{connectionName}'.");

        return NpgsqlDataSource.Create(connectionString);
    }

    public void Dispose()
    {
        foreach (var dataSource in _dataSources.Values)
        {
            dataSource.Dispose();
        }
    }
}