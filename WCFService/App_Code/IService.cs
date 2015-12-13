using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web;


// NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService" in both code and config file together.
[ServiceContract]
public interface IService
{
    [OperationContract]
    [WebInvoke(UriTemplate = "signUp/{request}", Method = "POST")]
    Result signUp(User request);

    [OperationContract]
    [WebInvoke(UriTemplate = "login/{request}", Method = "POST")]
    Result login(User request);

    [OperationContract]
    [WebInvoke(UriTemplate = "verifyUser/{request}", Method = "POST")]
    Result verifyUser(User request);

    [OperationContract]
    [WebInvoke(UriTemplate = "updateProfile/{request}", Method = "POST")]
    Result updateProfile(User request);

    [OperationContract]
    [WebInvoke(UriTemplate = "submitMealPlan/{request}", Method = "POST")]
    Result submitMealPlan(Meal request);

    [OperationContract]
    [WebInvoke(UriTemplate = "getMealPlan/{request}", Method = "POST")]
    Result getMealPlan(Meal request);

    [OperationContract]
    [WebInvoke(UriTemplate = "getMealPlanForToday/{request}", Method = "POST")]
    Result getMealPlanForToday(Meal request);

    [OperationContract]
    [WebInvoke(UriTemplate = "sendMealPlanByMail/{request}", Method = "POST")]
    Result sendMealPlanByMail(Meal request);

    [OperationContract]
    [WebInvoke(UriTemplate = "getProgressFor7Days/{request}", Method = "POST")]
    Result getProgressFor7Days(Meal request);


}

internal class WebInvokeAttribute : Attribute
{
    public string Method;
    public string UriTemplate;
}
