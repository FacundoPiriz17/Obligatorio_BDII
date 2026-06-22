using Backend_BDII.Modules.Infraestructura.DTOs;
using FluentValidation;

namespace Backend_BDII.Common.Validators.Infraestructura;

public sealed class RegistrarDispositivoPropioRequestValidator
    : AbstractValidator<RegistrarDispositivoPropioRequest>
{
    public RegistrarDispositivoPropioRequestValidator()
    {
        RuleFor(x => x.InstallationId)
            .NotEmpty().WithMessage("El installationId es obligatorio.")
            .MinimumLength(16).WithMessage("El installationId debe tener al menos 16 caracteres.")
            .MaximumLength(64).WithMessage("El installationId no puede superar los 64 caracteres.");

        RuleFor(x => x.Modelo)
            .MaximumLength(30).WithMessage("El modelo no puede superar los 30 caracteres.")
            .When(x => !string.IsNullOrWhiteSpace(x.Modelo));
    }
}