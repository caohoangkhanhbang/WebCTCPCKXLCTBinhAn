namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public interface IManipulationDB
    {
        Task<bool> InsertDynamicAsync(
       string tableName,
       Dictionary<string, object?> data);

        Task<bool> UpdateDynamicAsync(
            string tableName,
            Dictionary<string, object?> dataToUpdate,
            Dictionary<string, object?> whereConditions);

        Task<bool> DeleteDynamicAsync(
            string tableName,
            Dictionary<string, object?> whereConditions);
    }
}
