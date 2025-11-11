from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer


azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id="", tenant_id="", scopes={"": ""}, allow_guest_users=True
)
