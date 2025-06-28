using UserManagement.API.Models;
namespace UserManagement.API.Data.Repositories
{
    public interface IUserManagementRepository
    {
        Task<IEnumerable<UserModel>> GetAllUsersAsync();
        Task<PaginatedResponseModel<UserModel>> GetUsersAsync(PaginatedRequestModel request);
        Task<UserModel?> GetUserByIdAsync(int id);
        Task<UserModel?> GetUserByUsernameAsync(string username);
        Task AddUserAsync(UserModel user);
        Task UpdateUserAsync(UserModel user);
        Task DeleteUserAsync(int id);
        Task<UserModel?> ValidateUser(string username, string password);
    }
}
