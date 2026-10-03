using MediatR;
using Microsoft.AspNetCore.Mvc;
using OrishaTest.Application.Common.Bases;
using OrishaTest.Application.DataTransfertObject;
using OrishaTest.Application.Features.Orders.Commands.UpdateCartonReception;
using OrishaTest.Application.Features.Orders.Commands.UpdateProductReception;
using OrishaTest.Application.Features.Orders.Queries.GetOrderById;
using OrishaTest.Application.Features.Orders.Queries.GetOrders;

namespace OrishaTest.Api.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET api/orders?pageNumber=1&pageSize=10&search=xxx
        [HttpGet]
        [ProducesResponseType(typeof(ItemPagedResult<OrderSummaryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetOrders([FromQuery] GetOrdersQuery query, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        // GET api/orders/{id}
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(OrderDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderById([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetOrderByIdQuery(id), cancellationToken);

            if (result is null)
                return NotFound(new { message = $"Order with id '{id}' was not found." });

            return Ok(result);
        }

        // PUT api/orders/{orderId}/products/{productId}/reception
        [HttpPut("{orderId:guid}/products/{productId:guid}/reception")]
        [ProducesResponseType(typeof(OrderDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProductReception( [FromRoute] Guid orderId,[FromRoute] Guid productId,[FromBody] UpdateProductReceptionCommand command, CancellationToken cancellationToken){

            command.OrderId = orderId;
            command.ProductId = productId;

            var result = await _mediator.Send(command, cancellationToken);
            if (result is null)
                return NotFound(new { message = "Order or product not found." });

            return Ok(result);
        }

        // PUT api/orders/{orderId}/cartons/{cartonId}/reception
        [HttpPut("{orderId:guid}/cartons/{cartonId:guid}/reception")]
        [ProducesResponseType(typeof(OrderDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCartonReception([FromRoute] Guid orderId,[FromRoute] Guid cartonId, [FromBody] UpdateCartonReceptionCommand command,CancellationToken cancellationToken)
        {
            command.OrderId = orderId;
            command.CartonId = cartonId;

            var result = await _mediator.Send(command, cancellationToken);
            if (result is null)
                return NotFound(new { message = "Order or carton not found." });

            return Ok(result);
        }
    }
}