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
    [WebInvoke(UriTemplate = "login/{request}", Method = "GET")]
    Result login(User request);

    [OperationContract]
    [WebInvoke(UriTemplate = "verifyUser/{request}", Method = "GET")]
    Result verifyUser(User request);

    [OperationContract]
    [WebInvoke(UriTemplate = "updateProfile/{request}", Method = "GET")]
    Result updateProfile(User request);
}

internal class WebInvokeAttribute : Attribute
{
    public string Method;
    public string UriTemplate;
}
