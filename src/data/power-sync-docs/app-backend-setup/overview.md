# App Backend Setup

PowerSync generally assumes that you have some kind of "backend application" as part of your overall application architecture - whether it's Supabase, Node.js, Rails, Laravel, Django, ASP.NET, some kind of serverless cloud functions (e.g. Azure Functions, AWS Lambda, Google Cloud Functions, Cloudflare Workers, etc.), or anything else.

When you integrate PowerSync into your app project, PowerSync relies on that "backend application" for a few purposes:

1. **Allowing client-side write operations to be uploaded** and [applied](/installation/app-backend-setup/writing-client-changes) to the backend database (Postgres, MongoDB, MySQL, or SQL Server). When you write to the client-side SQLite database provided by PowerSync, those writes are also placed into an upload queue. The PowerSync Client SDK manages uploading of those writes to your backend using the `uploadData()` function that you defined in the [Client-Side Setup](/installation/client-side-setup/integrating-with-your-backend) part of the implementation. That `uploadData()` function should call your backend application API to apply the writes to your backend database. The reason why we designed PowerSync this way is to give you full control over things like data validation and authorization of writes, while PowerSync itself requires minimal permissions.
2. **Authentication integration:** Your backend is responsible for securely generating the [JWTs](/installation/authentication-setup) used by the PowerSync Client SDK to authenticate with the [PowerSync Service](/architecture/powersync-service).

<Frame caption="An overview of how PowerSync interacts with your backend application.">
  <img src="https://mintcdn.com/powersync/lquPOu2QW4XM9BQW/images/installation/powersync-docs-diagram-app-backend-setup.png?fit=max&auto=format&n=lquPOu2QW4XM9BQW&q=85&s=8de27ffc771260b003d2cb7b9c9624c1" data-og-width="1920" width="1920" data-og-height="1080" height="1080" data-path="images/installation/powersync-docs-diagram-app-backend-setup.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/powersync/lquPOu2QW4XM9BQW/images/installation/powersync-docs-diagram-app-backend-setup.png?w=280&fit=max&auto=format&n=lquPOu2QW4XM9BQW&q=85&s=758fbf7227fac10fc47fca058c9dc151 280w, https://mintcdn.com/powersync/lquPOu2QW4XM9BQW/images/installation/powersync-docs-diagram-app-backend-setup.png?w=560&fit=max&auto=format&n=lquPOu2QW4XM9BQW&q=85&s=842d23d0172503d6177c2fe9cf96e913 560w, https://mintcdn.com/powersync/lquPOu2QW4XM9BQW/images/installation/powersync-docs-diagram-app-backend-setup.png?w=840&fit=max&auto=format&n=lquPOu2QW4XM9BQW&q=85&s=3436d6be7318592edd4b07a9533457e1 840w, https://mintcdn.com/powersync/lquPOu2QW4XM9BQW/images/installation/powersync-docs-diagram-app-backend-setup.png?w=1100&fit=max&auto=format&n=lquPOu2QW4XM9BQW&q=85&s=7a9abbe78738fd77f4744f3b2b0d886c 1100w, https://mintcdn.com/powersync/lquPOu2QW4XM9BQW/images/installation/powersync-docs-diagram-app-backend-setup.png?w=1650&fit=max&auto=format&n=lquPOu2QW4XM9BQW&q=85&s=b5fb9bf00dcec4c74decb401643c092e 1650w, https://mintcdn.com/powersync/lquPOu2QW4XM9BQW/images/installation/powersync-docs-diagram-app-backend-setup.png?w=2500&fit=max&auto=format&n=lquPOu2QW4XM9BQW&q=85&s=870affa3f104f996a1cf9bdbaf79eb49 2500w" />
</Frame>

### Processing Writes from Clients

The next section, [Writing Client Changes](/installation/app-backend-setup/writing-client-changes), provides guidance on how can handle write operations in your backend application.

### Authentication

General authentication for your app users is outside the scope of PowerSync. A service such as [Auth0](https://auth0.com/) or [Clerk](https://clerk.com/) may be used, or any other authentication system.

PowerSync assumes that you have some kind of authentication system already in place that allows you to communicate securely between your client-side app and backend application.

The `fetchCredentials()` function that you defined in the [Client-Side Setup](/installation/client-side-setup/integrating-with-your-backend) can therefore call your backend application API to generate a JWT which can be used by PowerSync Client SDK to authenticate with the [PowerSync Service](/architecture/powersync-service).

See [Authentication Setup](/installation/authentication-setup) for details.

### Backend Implementation Examples

See our [Example Projects](/resources/demo-apps-example-projects#backend-examples) page for examples of custom backend implementations (e.g. Django, Node.js, Rails, etc.)

For Postgres developers, using [Supabase](/integration-guides/supabase-+-powersync) is an easy alternative to a custom backend. Several of our demo apps demonstrate how to use [Supabase](https://supabase.com/) as the Postgres backend.

### Hosted/Managed Option for MongoDB

<Tip>For developers using MongoDB as a source backend database, an alternative option to running your own backend is to use CloudCode, a serverless cloud functions environment provided by us. We have a template that you can use as a turnkey starting point. See our [documentation here](/usage/tools/cloudcode).</Tip>

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.powersync.com/llms.txt
