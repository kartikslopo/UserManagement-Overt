using UserManagement.API.Models;
namespace UserManagement.API.Services
{
    public interface ITokenService
    {
        string GenerateToken(UserModel user);
    }
}
