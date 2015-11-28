using System.Collections.Generic;
using System.Web.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Web;

using System.Collections;
using System.Linq;
using System;

[System.ServiceModel.ServiceBehavior(IncludeExceptionDetailInFaults = true)]
// NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service" in code, svc and config file together.
public class Service : IService
{

    public string connectionstring = WebConfigurationManager.ConnectionStrings["AW2k"].ConnectionString;
    public Result response = new Result();
    public Result signUp(User userInput)
    {
        insertNewUser(userInput);
        return response;
    }

    public Result login(User userInput)
    {
        loginUser(userInput);
        return response;
    }

    public void loginUser(User userInput)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            String userName = userInput.UserName;
            String password = userInput.Password;
            string sql = "SELECT UserId FROM Users WHERE Email = '" + userName + "' and Password = '" + password + "'";

            sqlCon.Open();

            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();
            response.message = dt.ToString();
            if (dt != null && dt.Rows.Count > 0) //Passwords match 
            {
                response.status = "success";
                response.message = "Correct";
            }
            else
            {
                response.status = "error";
                response.message = "Email id or Pwd do not match";
            }

        }
    }

    public void insertNewUser(User userInput)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            String userName = userInput.UserName;
            string sql = "SELECT UserId FROM Users WHERE Email = '"+ userName +"'";

           
            sqlCon.Open();

            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();
            response.message = dt.ToString();
            if (dt != null && dt.Rows.Count > 0) // Email id is  duplicate
            {
                response.status = "error";
                response.message = "Email id already exits";
            } else
            {
                int id = getLastInsertedUserId();
                doInsert(userInput, (id + 1));
            }
        }
    }

    public int getLastInsertedUserId()
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "SELECT Max(UserId) FROM Users";
            int id;

            sqlCon.Open();
            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();

            if(dt!= null) // Means match was found
            {
                DataRow row = dt.Rows[0];   
                string userId = row[0].ToString();
                if (userId == "")
                    return 0;
                else
                {
                    id = int.Parse(userId);
                    return id;
                }
            } else
            {
                return 0;
            }        
        }
    }

    public void doInsert(User userInput,int id)
    {
        String userName = userInput.UserName;
        String password = userInput.Password;

        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "INSERT INTO Users (UserId,Email,Password) VALUES ('"+id+"', '" + userName + "' , '" + password + " ')";

            SqlDataAdapter da = new SqlDataAdapter();
            SqlCommand command = new SqlCommand(sql, sqlCon);
            try
            {
                sqlCon.Open();
                da.InsertCommand = new SqlCommand(sql, sqlCon);
                da.InsertCommand.ExecuteNonQuery();
                response.status = "success";
                response.message = "Inserted Successfully";
            }
            catch (Exception ex)
            {
                response.status = "error";
                response.message = "There was an error inserting"+ ex;
            }
        }
    }
}

public class User
{
    private string userName;
    private string password;

    public string UserName
    {
        get
        {
            return userName;
        }
        set
        {
            userName = value;
        }
    }

    public string Password
    {
        get
        {
            return password;
        }
        set
        {
            password = value;
        }
    }
}

public class Result
{
    public string status;
    public string message;
}


