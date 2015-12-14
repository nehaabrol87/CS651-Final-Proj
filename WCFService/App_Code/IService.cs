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
    [WebInvoke(UriTemplate = "getMealPlanForDate/{request}", Method = "POST")]
    Result getMealPlanForDate(Meal request);

    [OperationContract]
    [WebInvoke(UriTemplate = "sendMealPlanByMail/{request}", Method = "POST")]
    Result sendMealPlanByMail(Meal request);

    [OperationContract]
    [WebInvoke(UriTemplate = "getMealProgressFor8Days/{request}", Method = "POST")]
    Result getMealProgressFor8Days(Meal request);

    [OperationContract]
    [WebInvoke(UriTemplate = "submitDietCompletion/{request}", Method = "POST")]
    Result submitDietCompletion(Meal request);

    [OperationContract]
    [WebInvoke(UriTemplate = "submitActivityPlan/{request}", Method = "POST")]
    Result submitActivityPlan(Activity request);

    [OperationContract]
    [WebInvoke(UriTemplate = "getActivityPlanForDate/{request}", Method = "POST")]
    Result getActivityPlanForDate(Activity request);

    [OperationContract]
    [WebInvoke(UriTemplate = "sendActivityPlanByMail/{request}", Method = "POST")]
    Result sendActivityPlanByMail(Activity request);
}

internal class WebInvokeAttribute : Attribute
{
    public string Method;
    public string UriTemplate;
}
