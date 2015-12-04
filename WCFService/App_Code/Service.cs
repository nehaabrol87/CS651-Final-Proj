using System.Collections.Generic;
using System.Web.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Web;
using System.Net.Mail;
using System.Collections;
using System.Linq;
using System;
using System.Text;

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

    public Result verifyUser(User userInput)
    {
        verify(userInput);
        return response;
    }

    public Result updateProfile(User userInput)
    {
        updateUser(userInput);
        return response;
    }

    public void updateUser(User userInput)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string dob = userInput.Dob;
            string gender = userInput.Gender;
            int height_ft = userInput.Height_ft;
            int height_in = userInput.Height_in;
            int weight = userInput.Weight;
            string userName = userInput.UserName;

            string sql = "Update Users SET PersonalData = 'Y',Dob = '"+ dob +"', Gender = '"+ gender +" ', Height_ft = '"+ height_ft+ "', Height_in = '"+ height_in + "', Weight = '"+ weight +"'  WHERE Email = '" + userName + "' and PersonalData = 'N'";

            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            try
            {
                sqlCon.Open();
                da.UpdateCommand = new SqlCommand(sql, sqlCon);
                int noOfRows = da.UpdateCommand.ExecuteNonQuery();
                if (noOfRows > 0)
                {
                    response.status = "success";
                    response.message = "User updated successfully.You will be redirected to your profile";
                } else
                {
                    response.status = "error";
                    response.message = "There was an error updating your Profile";

                }
                
            }
            catch (Exception ex)
            {
                response.status = "error";
                response.message = "There was an error updating your Profile" + ex;
            }
            sqlCon.Close();
        }

    }

    public void verify(User userInput)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            String userId = userInput.UserId;
            String token = userInput.Token;
            string sql = "SELECT UserId FROM Users WHERE UserId = '" + userId + "' and token = '" + token + "' and verified = 'N'";

            sqlCon.Open();
            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();
            response.message = dt.ToString();
            if (dt != null && dt.Rows.Count > 0)
            {
                updateVerificationStatus(userId, token);
            }
            else
            {
                response.status = "error";
                response.message = "This user has already been verified or this is an incorrect link";
            }
            sqlCon.Close();
        }
    }

    public void updateVerificationStatus(String userId, String token)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "Update Users SET verified = 'Y' WHERE UserId = '" + userId + "' and token = '" + token + "'";

            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            try
            {
                sqlCon.Open();
                da.UpdateCommand = new SqlCommand(sql, sqlCon);
                int noOfRows= da.UpdateCommand.ExecuteNonQuery();

                if (noOfRows>0)
                {
                    response.status = "success";
                    response.message = "User activated successfully.Login to access profile";
                } else
                {
                    response.status = "error";
                    response.message = "There was an error activating your account";

                }
                
            }
            catch (Exception ex)
            {
                response.status = "error";
                response.message = "There was an error activating your account" + ex;
            }
            sqlCon.Close();
        }
    }

    public void loginUser(User userInput)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            String userName = userInput.UserName;
            String password = userInput.Password;
            string sql = "SELECT FirstName,PersonalData FROM Users WHERE Email = '" + userName + "' and Password = '" + password + "' and verified = 'Y'";

            sqlCon.Open();

            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();
            if (dt != null && dt.Rows.Count > 0) //Passwords match 
            {
                DataRow row = dt.Rows[0];
                response.status = "success";
                response.personalData = row[1].ToString();
                response.message = row[0].ToString();
            }
            else
            {
                response.status = "error";
                response.message = "Email id or Pwd do not match.Make sure Email is verified";
            }
            sqlCon.Close();
        }
    }

    public void insertNewUser(User userInput)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            String userName = userInput.UserName;
            string sql = "SELECT UserId FROM Users WHERE Email = '" + userName + "'";
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
            }
            else
            {
                int id = getLastInsertedUserId();
                String token = generateUniqueToken();
                if (token != "error")
                {
                    doInsert(userInput, (id + 1), token);
                }
                else
                {
                    response.status = "error";
                    response.message = "There was an error processing your request";

                }
                sqlCon.Close();
            }
        }
    }

    public String generateUniqueToken()
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "SELECT NEWID()";
            sqlCon.Open();

            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();
            response.message = dt.ToString();
            if (dt != null && dt.Rows.Count > 0) // Email id is  duplicate
            {
                DataRow row = dt.Rows[0];
                return row[0].ToString();
            }
            else
            {
                return "error";
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
            if (dt != null) // Means match was found
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
            }
            else
            {
                return 0;
            }

        }
    }

    public void doInsert(User userInput, int id, String token)
    {
        String userName = userInput.UserName;
        String password = userInput.Password;
        String firstName = userInput.FirstName;

        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "INSERT INTO Users (FirstName,UserId,Email,Password,PersonalData,Verified,Token) VALUES ('" + firstName + "','" + id + "', '" + userName + "' , '" + password + " ','N','N','" + token + "')";

            SqlDataAdapter da = new SqlDataAdapter();
            SqlCommand command = new SqlCommand(sql, sqlCon);
            try
            {
                sqlCon.Open();
                da.InsertCommand = new SqlCommand(sql, sqlCon);
                int noOfRows=da.InsertCommand.ExecuteNonQuery();

                if (noOfRows > 0)
                {
                    sendEmail(userName, firstName, token, id);
                    response.status = "success";
                    response.message = "User created.Please verify email to activate user";
                } else
                {
                    response.status = "error";
                    response.message = "There was an error inserting";
                }
                
            }
            catch (Exception ex)
            {
                response.status = "error";
                response.message = "There was an error inserting" + ex;
            }
            sqlCon.Close();
        }
    }

    public void sendEmail(String userName, String firstName, String token, int id)
    {
        String msgBody = "";
        msgBody = "Hi " + firstName + ",\n \n Please click on below link to activate your account \n \n" +
            "http://localhost:8080/#/activate?userId=" + id + "&token=" + token
            + "\n \n Regards, \n \n Healthy Humans";
        SmtpClient client = new SmtpClient();
        client.Port = 587;
        client.Host = "smtp.gmail.com";
        client.EnableSsl = true;
        client.Timeout = 20000;
        client.DeliveryMethod = SmtpDeliveryMethod.Network;
        client.UseDefaultCredentials = false;
        client.Credentials = new System.Net.NetworkCredential("healthyhumans123@gmail.com", "dotnetproject");

        MailMessage mm = new MailMessage("donotreply@domain.com", userName, "Welcome to Healthy Humans", msgBody);
        mm.BodyEncoding = UTF8Encoding.UTF8;
        mm.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;

        client.Send(mm);
    }
}

public class User
{
    private string userName;
    private string password;
    private string firstName;
    private string userId;
    private string token;
    private int height_in;
    private int height_ft;
    private int weight;
    private string dob;
    private string gender;

    public string Token
    {
        get
        {
            return token;
        }
        set
        {
            token = value;
        }
    }

    public string UserId
    {
        get
        {
            return userId;
        }
        set
        {
            userId = value;
        }
    }

    public string FirstName
    {
        get
        {
            return firstName;
        }
        set
        {
            firstName = value;
        }
    }

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

    public string Dob
    {
        get
        {
            return dob;
        }
        set
        {
            dob = value;
        }
    }

    public string Gender
    {
        get
        {
            return gender;
        }
        set
        {
            gender = value;
        }
    }

    public int Height_ft
    {
        get
        {
            return height_ft;
        }
        set
        {
            height_ft = value;
        }
    }

    public int Height_in
    {
        get
        {
            return height_in;
        }
        set
        {
            height_in = value;
        }
    }

    public int Weight
    {
        get
        {
            return weight;
        }
        set
        {
            weight = value;
        }
    }
}

public class Result
{
    public string status;
    public string message;
    public string personalData;
}


