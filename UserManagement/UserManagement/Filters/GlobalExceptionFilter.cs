using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using System.Net;

namespace UserManagement.API.Filters
{
    public class GlobalExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<GlobalExceptionFilter> _logger;

        public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
        {
            _logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            var request = context.HttpContext.Request;
            var user = context.HttpContext.User?.Identity?.Name ?? "Anonymous";

            // Log the exception with context
            _logger.LogError(exception, 
                "Unhandled exception occurred. User: {User}, Method: {Method}, Path: {Path}, Query: {Query}",
                user, request.Method, request.Path, request.QueryString);

            // Determine the response based on exception type
            var response = exception switch
            {
                ArgumentException argEx => new
                {
                    error = "Invalid argument",
                    message = argEx.Message,
                    statusCode = (int)HttpStatusCode.BadRequest
                },
                UnauthorizedAccessException => new
                {
                    error = "Unauthorized access",
                    message = "You do not have permission to perform this action",
                    statusCode = (int)HttpStatusCode.Unauthorized
                },
                KeyNotFoundException => new
                {
                    error = "Resource not found",
                    message = "The requested resource was not found",
                    statusCode = (int)HttpStatusCode.NotFound
                },
                InvalidOperationException invalidOpEx => new
                {
                    error = "Invalid operation",
                    message = invalidOpEx.Message,
                    statusCode = (int)HttpStatusCode.BadRequest
                },
                _ => new
                {
                    error = "Internal server error",
                    message = "An unexpected error occurred. Please try again later.",
                    statusCode = (int)HttpStatusCode.InternalServerError
                }
            };

            // Set the response
            context.Result = new ObjectResult(response)
            {
                StatusCode = response.statusCode
            };

            // Mark exception as handled
            context.ExceptionHandled = true;
        }
    }
}
