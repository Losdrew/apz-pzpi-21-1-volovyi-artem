using AutoCab.Shared.Errors.Base;

namespace AutoCab.Shared.Errors.ServiceErrors;

public class UserError : ServiceError
{
    public static UserError InvalidAuthorization = new()
    {
        Header = "Invalid authorization",
        ErrorMessage = "Invalid authorization",
        Code = 1
    };

    public static UserError UserNotFound = new()
    {
        Header = "User not found",
        ErrorMessage = "User not found",
        Code = 2
    };

    public static UserError ForbiddenAccess = new()
    {
        Header = "Access forbidden",
        ErrorMessage = "You don't have access",
        Code = 3
    };
}