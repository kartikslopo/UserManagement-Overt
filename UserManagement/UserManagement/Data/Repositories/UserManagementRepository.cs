using UserManagement.API.Models;

namespace UserManagement.API.Data.Repositories
{
    public class UserManagementRepository:IUserManagementRepository
    {
        private readonly ISqlDataAccess _db;
        private readonly ILogger<UserManagementRepository> _logger;

        public UserManagementRepository(ISqlDataAccess db, ILogger<UserManagementRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<IEnumerable<UserModel>> GetAllUsersAsync()
        {
            _logger.LogInformation("Retrieving all users from database");
            try
            {
                string query = "SELECT * FROM Users";
                var users = await _db.LoadDataQuery<UserModel>(query);
                _logger.LogInformation("Successfully retrieved {UserCount} users", users.Count());
                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all users from database");
                throw;
            }
        }
        public async Task<UserModel?> ValidateUser(string username, string password)
        {
            _logger.LogInformation("Validating user credentials for username: {Username}", username);
            try
            {
                var user = await GetUserByUsernameAsync(username);
                if (user == null)
                {
                    _logger.LogWarning("User not found during validation: {Username}", username);
                    return null;
                }

                if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    _logger.LogWarning("Invalid password for user: {Username}", username);
                    return null;
                }

                _logger.LogInformation("User credentials validated successfully: {Username}", username);
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating user credentials for username: {Username}", username);
                throw;
            }
        }

        public async Task<UserModel?> GetUserByIdAsync(int id)
        {
            _logger.LogInformation("Retrieving user by ID: {UserId}", id);
            try
            {
                string query = $"SELECT * FROM Users WHERE Id = '{id}'";
                var result = await _db.LoadDataQuery<UserModel>(query);
                var user = result.FirstOrDefault();
                
                if (user != null)
                    _logger.LogInformation("User found by ID: {UserId}, Username: {Username}", id, user.Username);
                else
                    _logger.LogWarning("User not found by ID: {UserId}", id);
                    
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user by ID: {UserId}", id);
                throw;
            }
        }

        public async Task<UserModel?> GetUserByUsernameAsync(string username)
        {
            _logger.LogInformation("Retrieving user by username: {Username}", username);
            try
            {
                string query = $"SELECT * FROM Users WHERE Username = '{username}'";
                var result = await _db.LoadDataQuery<UserModel>(query);
                var user = result.FirstOrDefault();
                
                if (user != null)
                    _logger.LogInformation("User found by username: {Username}, ID: {UserId}", username, user.Id);
                else
                    _logger.LogWarning("User not found by username: {Username}", username);
                    
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user by username: {Username}", username);
                throw;
            }
        }

        public async Task AddUserAsync(UserModel user)
        {
            _logger.LogInformation("Adding new user: {Username}, Role: {Role}", user.Username, user.Role);
            try
            {
                await _db.SaveDataQuery($@"
                    INSERT INTO Users (Username, PasswordHash, Role, Name, Description)
                    VALUES ('{user.Username}', '{user.PasswordHash}', '{user.Role}', '{user.Name}', '{user.Description}')");
                _logger.LogInformation("User added successfully: {Username}", user.Username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding user: {Username}", user.Username);
                throw;
            }
        }

        public async Task UpdateUserAsync(UserModel user)
        {
            _logger.LogInformation("Updating user: ID {UserId}, Username: {Username}", user.Id, user.Username);
            try
            {
                await _db.SaveDataQuery($@"
                UPDATE Users SET
                Username = '{user.Username}',
                PasswordHash = '{user.PasswordHash}',
                Role = '{user.Role}',
                Name = '{user.Name}',
                Description = '{user.Description}'
                 WHERE Id = {user.Id}");
                _logger.LogInformation("User updated successfully: ID {UserId}, Username: {Username}", user.Id, user.Username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user: ID {UserId}, Username: {Username}", user.Id, user.Username);
                throw;
            }
        }

        public async Task DeleteUserAsync(int id)
        {
            _logger.LogInformation("Deleting user: ID {UserId}", id);
            try
            {
                string query = $"DELETE FROM Users WHERE Id = {id}";
                await _db.SaveDataQuery(query);
                _logger.LogInformation("User deleted successfully: ID {UserId}", id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user: ID {UserId}", id);
                throw;
            }
        }

        public async Task<PaginatedResponseModel<UserModel>> GetUsersAsync(PaginatedRequestModel request)
        {
            _logger.LogInformation("Retrieving paginated users: Page {Page}, PageSize {PageSize}, SearchTerm: {SearchTerm}, SortBy: {SortBy}", 
                request.Page, request.PageSize, request.SearchTerm, request.SortBy);
            
            try
            {
                // Calculate offset for pagination
                int offset = (request.Page - 1) * request.PageSize;
                
                // Build WHERE clause for search
                string whereClause = "";
                if (!string.IsNullOrWhiteSpace(request.SearchTerm))
                {
                    whereClause = $@"WHERE Username LIKE '%{request.SearchTerm}%' 
                                    OR Name LIKE '%{request.SearchTerm}%' 
                                    OR Role LIKE '%{request.SearchTerm}%' 
                                    OR Description LIKE '%{request.SearchTerm}%'";

                }
                
                // Build ORDER BY clause
                string orderBy = $"ORDER BY {request.SortBy} {request.SortDirection.ToUpper()}";
                
                // Get total count
                string countQuery = $"SELECT COUNT(*) FROM Users {whereClause}";
                int totalCount = await _db.LoadSingleValue<int>(countQuery);
                
                // Get paginated data
                string dataQuery = $@"
                    SELECT * FROM Users 
                    {whereClause}
                    {orderBy}
                    OFFSET {offset} ROWS
                    FETCH NEXT {request.PageSize} ROWS ONLY";
                
                var users = await _db.LoadDataQuery<UserModel>(dataQuery);
                
                // Calculate pagination info
                int totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);
                
                _logger.LogInformation("Retrieved {UserCount} users out of {TotalCount} total (Page {Page} of {TotalPages})", 
                    users.Count(), totalCount, request.Page, totalPages);
                
                return new PaginatedResponseModel<UserModel>
                {
                    Data = users.ToList(),
                    TotalCount = totalCount,
                    Page = request.Page,
                    PageSize = request.PageSize,
                    TotalPages = totalPages,
                    HasNextPage = request.Page < totalPages,
                    HasPreviousPage = request.Page > 1
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving paginated users");
                throw;
            }
        }
    }
}
