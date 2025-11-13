import os
from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer


def getScopes() -> dict[str, str]:
    scope_env: str = os.getenv("RPM_PACKAGES_AUTH_SCOPES", "")
    scopes: dict = {}
    for single_scope in scope_env.split(";"):
        scopes[single_scope] = ""
    return scopes


azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id=os.getenv("RPM_PACKAGES_AUTH_CLIENT_ID", ""),
    tenant_id=os.getenv("RPM_PACKAGES_AUTH_TENANT_ID", ""),
    scopes=getScopes(),
    allow_guest_users=True,
)
