using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace UserManagement.API.Data
{
    public class SqlDataAccess:ISqlDataAccess
    {
        private readonly IConfiguration _config;
        private readonly ILogger<SqlDataAccess> _logger;

        public SqlDataAccess(IConfiguration config, ILogger<SqlDataAccess> logger)
        {
            _config = config;
            _logger = logger;
        }
        public async Task<IEnumerable<T>> LoadData<T, U>(
            string storedProcedure,
            U parameters,
            string connectionId = "Default")
        {
            using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));

            return await connection.QueryAsync<T>(storedProcedure, parameters,
                commandType: CommandType.StoredProcedure);
        }
        public async Task<int> SaveData<T>(
           string storedProcedure,
           T parameters,
           string connectionId = "Default")
        {
            using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
            var tenantId = await connection.ExecuteScalarAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure);
            return Convert.ToInt32(tenantId);
        }
        public async Task<IEnumerable<T>> LoadDataQuery<T>(string query, string connectionId = "Default")
        {
            _logger.LogDebug("Executing query: {Query}", query);
            try
            {
                using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
                var result = await connection.QueryAsync<T>(query, commandType: CommandType.Text);
                _logger.LogDebug("Query executed successfully, returned {RowCount} rows", result.Count());
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing query: {Query}", query);
                throw;
            }
        }
        public async Task<IEnumerable<T>> LoadMultipleDataQuery<T>(string query, string connectionId = "Default")
        {
            using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
            using var multi = await connection.QueryMultipleAsync(query);
            var results = multi.Read<T>();
            return results;
        }
        public async Task<int> SaveDataQuery(string query, string connectionId = "Default")
        {
            _logger.LogDebug("Executing save query: {Query}", query);
            try
            {
                using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
                var rowsAffected = await connection.ExecuteAsync(query, commandType: CommandType.Text);
                _logger.LogDebug("Save query executed successfully, {RowsAffected} rows affected", rowsAffected);
                return rowsAffected;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing save query: {Query}", query);
                throw;
            }
        }

        public async Task<T> LoadSingleValue<T>(string query, string connectionId = "Default")
        {
            _logger.LogDebug("Executing single value query: {Query}", query);
            try
            {
                using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
                var result = await connection.QuerySingleOrDefaultAsync<T>(query, commandType: CommandType.Text);
                _logger.LogDebug("Single value query executed successfully, result: {Result}", result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing single value query: {Query}", query);
                throw;
            }
        }
    }
}
