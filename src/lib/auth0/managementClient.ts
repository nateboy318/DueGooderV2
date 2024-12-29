import { ManagementClient } from 'auth0';

const managementClient = new ManagementClient({
    domain: `${process.env.AUTH0_TENANT_AND_REGION}.auth0.com`,
    clientId: process.env.AUTH0_MANAGEMENT_APP_CLIENT_ID as string,
    clientSecret: process.env.AUTH0_MANAGEMENT_APP_CLIENT_SECRET as string,
});


export default managementClient;