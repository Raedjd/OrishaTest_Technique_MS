using OrishaTest.Application.Features.Orders.Commands.UpdateProductReception;

namespace OrishaTest.XUnitTests
{
    public class UpdateProductReceptionCommandValidatorTests
    {
        private readonly UpdateProductReceptionCommandValidator _validator = new();

        [Fact]
        public void NegativeQuantity_IsInvalid()
        {
            var command = new UpdateProductReceptionCommand { ReceivedQuantity = -1 };

            var result = _validator.Validate(command);

            Assert.False(result.IsValid);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(10)]
        public void PositiveOrZeroQuantity_IsValid(int quantity)
        {
            var command = new UpdateProductReceptionCommand { ReceivedQuantity = quantity };

            var result = _validator.Validate(command);

            Assert.True(result.IsValid);
        }
    }
}