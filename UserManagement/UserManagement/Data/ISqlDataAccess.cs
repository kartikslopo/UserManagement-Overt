using System.Data.SqlClient;
using System.Data;
namespace UserManagement.API.Data
{
    public interface ISqlDataAccess
    {
        Task<IEnumerable<T>> LoadData<T, U>(string storedProcedure, U parameters, string connectionId = "Default");
        Task<int> SaveData<T>(string storedProcedure, T parameters, string connectionId = "Default");
        Task<IEnumerable<T>> LoadDataQuery<T>(string query, string connectionId = "Default");
        Task<IEnumerable<T>> LoadMultipleDataQuery<T>(string query, string connectionId = "Default");
        Task<int> SaveDataQuery(string query, string connectionId = "Default");
        Task<T> LoadSingleValue<T>(string query, string connectionId = "Default");
    }
}
