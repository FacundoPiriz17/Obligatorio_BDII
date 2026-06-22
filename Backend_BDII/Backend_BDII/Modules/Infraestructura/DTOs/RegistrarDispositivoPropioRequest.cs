namespace Backend_BDII.Modules.Infraestructura.DTOs;

public sealed class RegistrarDispositivoPropioRequest
{
    public required string InstallationId { get; init; }
    public string? Modelo { get; init; }
}