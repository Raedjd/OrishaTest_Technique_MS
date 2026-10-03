using FluentValidation;

namespace OrishaTest.Application.Features.Orders.Commands.UpdateProductReception
{
    public class UpdateProductReceptionCommandValidator : AbstractValidator<UpdateProductReceptionCommand>
    {
        public UpdateProductReceptionCommandValidator()
        {
            RuleFor(x => x.ReceivedQuantity)
                .GreaterThanOrEqualTo(0).WithMessage("ReceivedQuantity cannot be negative.");
        }
    }
}