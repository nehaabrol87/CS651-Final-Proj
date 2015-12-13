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

    public Result submitMealPlan(Meal userInput)
    {
        submitMeal(userInput);
        return response;
    }
   
    public Result getMealPlan(Meal userInput)
    {
        getMealForDate(userInput);
        return response;
    }

    public Result getMealPlanForToday(Meal userInput)
    {
        getMealForDate(userInput);
        return response;
    }

    public Result sendMealPlanByMail(Meal userInput)
    {
        sendMealPlanEmail(userInput);
        response.status = "success";
        response.message = "Meal plan was mailed successfully";
        return response;

    }

    public Result getProgressFor7Days(Meal userInput)
    {
        List<Meal> progress = new List<Meal>();
        DateTime startDate = Convert.ToDateTime(userInput.StartDate);
        DateTime endDate = Convert.ToDateTime(userInput.EndDate);


        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "SELECT * FROM Meals WHERE Email = '" + userInput.Email + "' and Date >='" + startDate +"' and Date <= '" +endDate  +"'";

            sqlCon.Open();

            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();
            if (dt != null && dt.Rows.Count > 0) //No meal entered for tomorrow
            {
                foreach (DataRow dtRow in dt.Rows)
                {
                    progress.Add(new Meal
                    {
                        Fruits = dtRow[1].ToString(),
                        Veggies = dtRow[2].ToString(),
                        Grains = dtRow[3].ToString(),
                        Dairy = dtRow[4].ToString(),
                        Proteins = dtRow[5].ToString(),
                        CompletedDiet = dtRow[6].ToString(),
                        Date = dtRow[0].ToString()
                    });
                }
                response.progress = progress;
                response.message = "Got rows";
                response.status = "success";
            }
            else
            {
                response.status = "error";
                response.message = "No data for last 7 dates";         
            }
            sqlCon.Close();
            return response;
        }
    }

    public void sendMealPlanEmail(Meal userInput)
    {
        string userName = userInput.Email;
        DateTime mealDate = Convert.ToDateTime(userInput.Date);
        string fruit = userInput.Fruits;
        string veggies = userInput.Veggies;
        string grains = userInput.Grains;
        string dairy = userInput.Dairy;
        string proteins = userInput.Proteins;

        string msgBody = "";
        msgBody = "Hi " + userName + ",\n \n Your diet plan for "+ mealDate.ToString("mm/dd/yyyy") + " is \n \n" +
            "Fruit : "+ fruit + "\n\n" +
            "Veggies : " + veggies + "\n\n" +
            "Grains : " + grains + "\n\n" +
            "Dairy : " + dairy + "\n\n" +
            "Proteins : " + proteins + "\n\n" +
            "\n \n Regards, \n \n Healthy Humans(Happy Eating!!)";
        SmtpClient client = new SmtpClient();
        client.Port = 587;
        client.Host = "smtp.gmail.com";
        client.EnableSsl = true;
        client.Timeout = 20000;
        client.DeliveryMethod = SmtpDeliveryMethod.Network;
        client.UseDefaultCredentials = false;
        client.Credentials = new System.Net.NetworkCredential("healthyhumans123@gmail.com", "dotnetproject");

        MailMessage mm = new MailMessage("donotreply@domain.com", userName, "Your meal plan for " + mealDate.ToString("mm/dd/yyyy"), msgBody);
        mm.BodyEncoding = UTF8Encoding.UTF8;
        mm.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;

        client.Send(mm);

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
            string personType = userInput.PersonType;

            string sql = "Update Users SET PersonalData = 'Y',Dob = '"+ dob +"', Gender = '"+ gender +" ', Height_ft = '"+ height_ft+ "', Height_in = '"+ height_in + "', Weight = '"+ weight + "', PersonType = '"+ personType + "'WHERE Email = '" + userName + "' and PersonalData = 'N'";

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
            string userName = userInput.UserName;
            string password = userInput.Password;
            DateTime todaysDate = Convert.ToDateTime(userInput.Date);
    
            string sql = "SELECT FirstName,PersonalData,MealPlanEnteredForTomorrow,Dob,Height_ft,Height_in,Weight,Gender,PersonType FROM Users WHERE Email = '" + userName + "' and Password = '" + password + "' and verified = 'Y'";

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
                response.mealPlanEnteredForTomorrow = row[2].ToString();
                response.dob = row[3].ToString();
                response.height_ft = System.Convert.ToInt32(row[4].ToString());
                response.height_in = System.Convert.ToInt32(row[5].ToString());
                response.weight = System.Convert.ToInt32(row[6].ToString());
                response.gender = row[7].ToString();
                response.personType = row[8].ToString();
                response.firstName = row[0].ToString();
                response.message = "Email and password match";
                checkIfMealHasBeenEnteredForToday(userName,todaysDate);
            }
            else
            {
                response.status = "error";
                response.message = "Email id or Pwd do not match.Make sure Email is verified";
            }
            sqlCon.Close();
        }
    }

    public static long ConvertToUnixTime(DateTime datetime)
    {
        DateTime sTime = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        return (long)(datetime - sTime).TotalSeconds;
    }

    public void checkIfMealHasBeenEnteredForToday(string userName,DateTime todaysDate)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "SELECT * FROM Meals WHERE Email = '" + userName + "' and Date = '" + todaysDate + "'";

            sqlCon.Open();

            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();
            if (dt != null && dt.Rows.Count > 0) //No meal entered for tomorrow
            {
               //Do nothing
            }
            else
            {
                updateMealPlanEnteredForTomorrowValueForUser(userName,'N');
                response.mealPlanEnteredForTomorrow = "N";

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

    public void submitMeal(Meal request)
    {
        DateTime mealDate = Convert.ToDateTime(request.Date);
        string fruits = request.Fruits;
        string veggies = request.Veggies;
        string grains = request.Grains;
        string dairy = request.Dairy;
        string proteins = request.Proteins;
        string email = request.Email;
        string completedDiet = request.CompletedDiet;

        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "INSERT INTO Meals (Date,Fruit,Vegetable,Grain,Dairy,Proteins,Email,CompletedDiet) VALUES ('" + mealDate + "','" + fruits + "', '" + veggies + "' , '" + grains + " ', '"+ dairy  + "','" + proteins + "' , '"+email +"','N')";

            SqlDataAdapter da = new SqlDataAdapter();
            SqlCommand command = new SqlCommand(sql, sqlCon);
            try
            {
                sqlCon.Open();
                da.InsertCommand = new SqlCommand(sql, sqlCon);
                int noOfRows = da.InsertCommand.ExecuteNonQuery();

                if (noOfRows > 0)
                {
                    response.status = "success";
                    response.message = "Meal plan created.";
                    updateMealPlanEnteredForTomorrowValueForUser(email,'Y');
                }
                else
                {
                    response.status = "error";
                    response.message = "There was an error adding your mealPlan";
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

    public void updateMealPlanEnteredForTomorrowValueForUser(string email,char mealFlag)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "Update Users SET MealPlanEnteredForTomorrow = '"+ mealFlag +"' WHERE Email = '" + email +"'";

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
                    response.message = "Meal plan updated sucesfully";
                }
                else
                {
                    response.status = "error";
                    response.message = "There was an error adding your mealPlan";

                }

            }
            catch (Exception ex)
            {
                response.status = "error";
                response.message = "There was an error adding your mealPlan" + ex;
            }
            sqlCon.Close();
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
        string userName = userInput.UserName;
        string password = userInput.Password;
        string firstName = userInput.FirstName;

        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            string sql = "INSERT INTO Users (FirstName,UserId,Email,Password,PersonalData,Verified,Token,MealPlanEnteredForTomorrow,dob,gender,height_ft,height_in,weight) VALUES ('" + firstName + "','" + id + "', '" + userName + "' , '" + password + " ','N','N','" + token + "','N','','',0,0,0)";

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

    public void  getMealForDate(Meal userInput)
    {
        using (SqlConnection sqlCon = new SqlConnection(connectionstring))
        {
            String userName = userInput.Email;
            DateTime mealDate = Convert.ToDateTime(userInput.Date);

            string sql = "SELECT * FROM Meals WHERE Email = '" + userName + "' and Date = '"+mealDate+"'";
            sqlCon.Open();
            SqlCommand command = new SqlCommand(sql, sqlCon);
            SqlDataAdapter da = new SqlDataAdapter(command);
            DataTable dt = new DataTable();
            da.Fill(dt);
            DataRow dr = dt.NewRow();
            if (dt != null && dt.Rows.Count > 0) //Meal plan there  
            {
                DataRow row = dt.Rows[0];
                response.status = "success";
                response.fruit = row[1].ToString();
                response.veggies = row[2].ToString();
                response.grain = row[3].ToString();
                response.dairy = row[4].ToString();
                response.proteins = row[5].ToString();
                response.date = row[0].ToString();
                response.message = "Meal plan successfully retrieved";
            }
            else
            {
                response.status = "error";
                response.message = "No meal plan for this date";
            }
            sqlCon.Close();
            }
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
    private string personType;
    private string date;

    public string Date
    {
        get
        {
            return date;
        }
        set
        {
            date = value;
        }
    }

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

    public string PersonType
    {
        get
        {
            return personType;
        }
        set
        {
            personType = value;
        }
    }
}

public class Result
{
    public string status;
    public string message;
    public string firstName;
    public string personalData;
    public string mealPlanEnteredForTomorrow;
    public string dob;
    public int height_in;
    public int height_ft;
    public int weight;
    public string gender;
    public string personType;
    public string date;
    public string fruit;
    public string veggies;
    public string grain;
    public string dairy;
    public string proteins;
    public List<Meal> progress = new List<Meal>();
}

public class Meal
{
    private string date;
    private string fruits;
    private string veggies;
    private string grains;
    private string dairy;
    private string proteins;
    private string completedDiet;
    private string email;
    private string startDate;
    private string endDate;

    public string StartDate
    {
        get
        {
            return startDate;
        }
        set
        {
            startDate = value;
        }
    }

    public string EndDate
    {
        get
        {
            return endDate;
        }
        set
        {
            endDate = value;
        }
    }

    public string Date
    {
        get
        {
            return date;
        }
        set
        {
            date = value;
        }
    }

    public string Fruits
    {
        get
        {
            return fruits;
        }
        set
        {
            fruits = value;
        }
    }

    public string Veggies
    {
        get
        {
            return veggies;
        }
        set
        {
            veggies = value;
        }
    }

    public String Grains
    {
        get
        {
            return grains;
        }
        set
        {
            grains = value;
        }
    }

    public string Proteins
    {
        get
        {
            return proteins;
        }
        set
        {
            proteins = value;
        }
    }

    public string Dairy
    {
        get
        {
            return dairy;
        }
        set
        {
            dairy = value;
        }
    }

    public string CompletedDiet
    {
        get
        {
            return completedDiet;
        }
        set
        {
            completedDiet = value;
        }
    }

    public string Email
    {
        get
        {
            return email;
        }
        set
        {
            email = value;
        }
    }

}

