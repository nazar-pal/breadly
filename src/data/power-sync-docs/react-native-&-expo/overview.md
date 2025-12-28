# React Native & Expo

> Full SDK reference for using PowerSync in React Native clients

<CardGroup cols={3}>
  <Card title="PowerSync SDK on NPM" icon="npm" href="https://www.npmjs.com/package/@powersync/react-native">
    This SDK is distributed via NPM
  </Card>

  <Card title="Source Code" icon="github" href="https://github.com/powersync-ja/powersync-js/tree/main/packages/react-native">
    Refer to packages/react-native in the powersync-js repo on GitHub
  </Card>

  <Card title="API Reference" icon="book" href="https://powersync-ja.github.io/powersync-js/react-native-sdk">
    Full API reference for the PowerSync SDK
  </Card>

  <Card title="Example Projects" icon="code" href="/resources/demo-apps-example-projects">
    Gallery of example projects/demo apps built with React Native and PowerSync.
  </Card>

  <Card title="Changelog" icon="megaphone" href="https://releases.powersync.com/announcements/react-native-client-sdk">
    Changelog for the SDK
  </Card>
</CardGroup>

<Tip>
  **Note**: This page assumes you want to use PowerSync to sync your backend database with SQLite in your app. If you only want to use PowerSync to manage your local SQLite database without sync, install the SDK in your app and then refer to our [Local Only](/usage/use-case-examples/offline-only-usage) guide.
</Tip>

### SDK Features

- **Real-time streaming of database changes**: Changes made by one user are instantly streamed to all other users with access to that data. This keeps clients automatically in sync without manual polling or refresh logic.
- **Direct access to a local SQLite database**: Data is stored locally, so apps can read and write instantly without network calls. This enables offline support and faster user interactions.
- **Asynchronous background execution**: The SDK performs database operations in the background to avoid blocking the application’s main thread. This means that apps stay responsive, even during heavy data activity.
- **Query subscriptions for live updates**: The SDK supports query subscriptions that automatically push real-time updates to client applications as data changes, keeping your UI reactive and up to date.
- **Automatic schema management**: PowerSync syncs schemaless data and applies a client-defined schema using SQLite views. This architecture means that PowerSync SDKs can handle schema changes gracefully without requiring explicit migrations on the client-side.

## Installation

Add the [PowerSync React Native NPM package](https://www.npmjs.com/package/@powersync/react-native) to your project:

<Tabs>
  <Tab title="npm">
    ```bash  theme={null}
    npx expo install @powersync/react-native
    ```
  </Tab>

  <Tab title="yarn">
    ```bash  theme={null}
    yarn expo add @powersync/react-native
    ```
  </Tab>

  <Tab title="pnpm">
    ```
    pnpm expo install @powersync/react-native
    ```
  </Tab>
</Tabs>

### Install peer dependencies

PowerSync requires a SQLite database adapter.

<Tip>
  **Using Expo Go?** Our native database adapters listed below (OP-SQLite and React Native Quick SQLite) are not compatible with Expo Go's sandbox environment. To run PowerSync with Expo Go install our JavaScript-based adapter `@powersync/adapter-sql-js` instead. See details [here](/client-sdk-references/react-native-and-expo/expo-go-support).
</Tip>

Choose between:

<Tabs>
  <Tab title="OP-SQLite (Recommended)">
    [PowerSync OP-SQLite](https://www.npmjs.com/package/@powersync/op-sqlite) offers:

    * Built-in encryption support via SQLCipher
    * Smoother transition to React Native's New Architecture

    <Tabs>
      <Tab title="npm">
        ```bash  theme={null}
        npx expo install @powersync/op-sqlite @op-engineering/op-sqlite
        ```
      </Tab>

      <Tab title="yarn">
        ```bash  theme={null}
        yarn expo add @powersync/op-sqlite @op-engineering/op-sqlite
        ```
      </Tab>

      <Tab title="pnpm">
        ```
        pnpm expo install @powersync/op-sqlite @op-engineering/op-sqlite
        ```
      </Tab>
    </Tabs>

  </Tab>

  <Tab title="React Native Quick SQLite">
    The [@journeyapps/react-native-quick-sqlite](https://www.npmjs.com/package/@journeyapps/react-native-quick-sqlite) package is the original database adapter for React Native and therefore more battle-tested in production environments.

    <Tabs>
      <Tab title="npm">
        ```bash  theme={null}
        npx expo install @journeyapps/react-native-quick-sqlite
        ```
      </Tab>

      <Tab title="yarn">
        ```bash  theme={null}
        yarn expo add @journeyapps/react-native-quick-sqlite
        ```
      </Tab>

      <Tab title="pnpm">
        ```
        pnpm expo install @journeyapps/react-native-quick-sqlite
        ```
      </Tab>
    </Tabs>

    **iOS with `use_frameworks!`**

    If your iOS project uses `use_frameworks!`, add the `react-native-quick-sqlite` plugin to your app.json or app.config.js and configure the staticLibrary option:

    ```
    {
      "expo": {
        "plugins": [
          [
            "@journeyapps/react-native-quick-sqlite",
            {
              "staticLibrary": true
            }
          ]
        ]
      }
    }
    ```

    This plugin automatically configures the necessary build settings for `react-native-quick-sqlite` to work with `use_frameworks!`.

  </Tab>
</Tabs>

<Info>
  **Polyfills and additional notes:**

- For async iterator support with watched queries, additional polyfills are required. See the [Babel plugins section](https://www.npmjs.com/package/@powersync/react-native#babel-plugins-watched-queries) in the README.

- By default, this SDK connects to a PowerSync instance via WebSocket (from `@powersync/react-native@1.11.0`) or HTTP streaming (before `@powersync/react-native@1.11.0`). See [Developer Notes](/client-sdk-references/react-native-and-expo#developer-notes) for more details on connection methods and platform-specific requirements.

- When using the **OP-SQLite** package, we recommend adding this [metro config](https://github.com/powersync-ja/powersync-js/tree/main/packages/react-native#metro-config-optional)
  to avoid build issues.
  </Info>

## Getting Started

Before implementing the PowerSync SDK in your project, make sure you have completed these steps:

- Signed up for a PowerSync Cloud account ([here](https://accounts.journeyapps.com/portal/powersync-signup?s=docs)) or [self-host PowerSync](/self-hosting/getting-started).
- [Configured your backend database](/installation/database-setup) and connected it to your PowerSync instance.
- [Installed](/client-sdk-references/react-native-and-expo#installation) the PowerSync React Native SDK.

### 1. Define the Schema

The first step is defining the schema for the local SQLite database.

This schema represents a "view" of the downloaded data. No migrations are required — the schema is applied directly when the PowerSync database is constructed (as we'll show in the next step).

<Tip>
  **Generate schema automatically**

In the [PowerSync Dashboard](https://dashboard.powersync.com/), select your project and instance and click the **Connect** button in the top bar to generate the client-side schema in your preferred language. The schema will be generated based off your Sync Rules.

Similar functionality exists in the [CLI](/usage/tools/cli).

**Note:** The generated schema will exclude an `id` column, as the client SDK automatically creates an `id` column of type `text`. Consequently, it is not necessary to specify an `id` column in your schema. For additional information on IDs, refer to [Client ID](/usage/sync-rules/client-id).
</Tip>

The types available are `text`, `integer` and `real`. These should map directly to the values produced by the [Sync Rules](/usage/sync-rules). If a value doesn't match, it is cast automatically. For details on how Postgres types are mapped to the types below, see the section on [Types](/usage/sync-rules/types) in the _Sync Rules_ documentation.

**Example**:

<Info>
  **Note**: No need to declare a primary key `id` column - as PowerSync will automatically create this.
</Info>

```typescript powersync/AppSchema.ts theme={null}
import { column, Schema, Table } from '@powersync/react-native'

const lists = new Table({
  created_at: column.text,
  name: column.text,
  owner_id: column.text
})

const todos = new Table(
  {
    list_id: column.text,
    created_at: column.text,
    completed_at: column.text,
    description: column.text,
    created_by: column.text,
    completed_by: column.text,
    completed: column.integer
  },
  { indexes: { list: ['list_id'] } }
)

export const AppSchema = new Schema({
  todos,
  lists
})

// For types
export type Database = (typeof AppSchema)['types']
export type TodoRecord = Database['todos']
// OR:
// export type Todo = RowType<typeof todos>;
export type ListRecord = Database['lists']
```

### 2. Instantiate the PowerSync Database

Next, you need to instantiate the PowerSync database — this is the core managed database.

Its primary functions are to record all changes in the local database, whether online or offline. In addition, it automatically uploads changes to your app backend when connected.

**Example**:

<Tabs>
  <Tab title="React Native Quick SQLite">
    For getting started and testing PowerSync use the [@journeyapps/react-native-quick-sqlite](https://github.com/powersync-ja/react-native-quick-sqlite) package.
    <Note>By default, this SDK requires @journeyapps/react-native-quick-sqlite as a peer dependency.</Note>

    ```typescript powersync/system.ts theme={null}
    import { PowerSyncDatabase } from '@powersync/react-native';
    import { AppSchema } from './Schema';

    export const powersync = new PowerSyncDatabase({
        // The schema you defined in the previous step
        schema: AppSchema,
        // For other options see,
        // https://powersync-ja.github.io/powersync-js/web-sdk/globals#powersyncopenfactoryoptions
        database: {
            // Filename for the SQLite database — it's important to only instantiate one instance per file.
            // For other database options see,
            // https://powersync-ja.github.io/powersync-js/web-sdk/globals#sqlopenoptions
            dbFilename: 'powersync.db'
        }
    });
    ```

  </Tab>

  <Tab title="OP-SQLite">
    If you want to include encryption with SQLCipher use the [@powersync/op-sqlite](https://www.npmjs.com/package/@powersync/op-sqlite) package.
    <Note>If you've already installed `@journeyapps/react-native-quick-sqlite`, You will have to uninstall it and then install both `@powersync/op-sqlite` and it's peer dependency `@op-engineering/op-sqlite` to use this.</Note>

    ```typescript powersync/system.ts theme={null}
    import { PowerSyncDatabase } from '@powersync/react-native';
    import { OPSqliteOpenFactory } from '@powersync/op-sqlite'; // Add this import
    import { AppSchema } from './Schema';

    // Create the factory
    const opSqlite = new OPSqliteOpenFactory({
        dbFilename: 'powersync.db'
    });

    export const powersync = new PowerSyncDatabase({
        // For other options see,
        schema: AppSchema,
        // Override the default database
        database: opSqlite
    });
    ```

  </Tab>
</Tabs>

<Note>
  **SDK versions lower than 1.8.0**

In SDK versions lower than 1.8.0, you will need to use the deprecated [RNQSPowerSyncDatabaseOpenFactory](https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/RNQSPowerSyncDatabaseOpenFactory) syntax to instantiate the database.
</Note>

Once you've instantiated your PowerSync database, you will need to call the [connect()](https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/AbstractPowerSyncDatabase#connect) method to activate it.

```typescript powersync/system.ts theme={null}
import { Connector } from './Connector'

export const setupPowerSync = async () => {
  // Uses the backend connector that will be created in the next section
  const connector = new Connector()
  powersync.connect(connector)
}
```

### 3. Integrate with your Backend

The PowerSync backend connector provides the connection between your application backend and the PowerSync client-slide managed SQLite database.

It is used to:

1. Retrieve an auth token to connect to the PowerSync instance.
2. Apply local changes on your backend application server (and from there, to Postgres)

Accordingly, the connector must implement two methods:

1. [PowerSyncBackendConnector.fetchCredentials](https://github.com/powersync-ja/powersync-js/blob/ed5bb49b5a1dc579050304fab847feb8d09b45c7/packages/common/src/client/connection/PowerSyncBackendConnector.ts#L16) - This is called every couple of minutes and is used to obtain credentials for your app backend API. -> See [Authentication Setup](/installation/authentication-setup) for instructions on how the credentials should be generated.
2. [PowerSyncBackendConnector.uploadData](https://github.com/powersync-ja/powersync-js/blob/ed5bb49b5a1dc579050304fab847feb8d09b45c7/packages/common/src/client/connection/PowerSyncBackendConnector.ts#L24) - Use this to upload client-side changes to your app backend.
   -> See [Writing Client Changes](/installation/app-backend-setup/writing-client-changes) for considerations on the app backend implementation.

**Example**:

```typescript powersync/Connector.ts theme={null}
import {
  PowerSyncBackendConnector,
  AbstractPowerSyncDatabase,
  UpdateType
} from '@powersync/react-native'

export class Connector implements PowerSyncBackendConnector {
  /**
   * Implement fetchCredentials to obtain a JWT from your authentication service.
   * See https://docs.powersync.com/installation/authentication-setup
   * If you're using Supabase or Firebase, you can re-use the JWT from those clients, see:
   * https://docs.powersync.com/installation/authentication-setup/supabase-auth
   * https://docs.powersync.com/installation/authentication-setup/firebase-auth
   */
  async fetchCredentials() {
    return {
      // The PowerSync instance URL or self-hosted endpoint
      endpoint: 'https://xxxxxx.powersync.journeyapps.com',
      /**
       * To get started quickly, use a development token, see:
       * Authentication Setup https://docs.powersync.com/installation/authentication-setup/development-tokens) to get up and running quickly
       */
      token: 'An authentication token'
    }
  }

  /**
   * Implement uploadData to send local changes to your backend service.
   * You can omit this method if you only want to sync data from the database to the client
   * See example implementation here:https://docs.powersync.com/client-sdk-references/react-native-and-expo#3-integrate-with-your-backend
   */
  async uploadData(database: AbstractPowerSyncDatabase) {
    /**
     * For batched crud transactions, use data.getCrudBatch(n);
     * https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/SqliteBucketStorage#getcrudbatch
     */
    const transaction = await database.getNextCrudTransaction()

    if (!transaction) {
      return
    }

    for (const op of transaction.crud) {
      // The data that needs to be changed in the remote db
      const record = { ...op.opData, id: op.id }
      switch (op.op) {
        case UpdateType.PUT:
          // TODO: Instruct your backend API to CREATE a record
          break
        case UpdateType.PATCH:
          // TODO: Instruct your backend API to PATCH a record
          break
        case UpdateType.DELETE:
          //TODO: Instruct your backend API to DELETE a record
          break
      }
    }

    // Completes the transaction and moves onto the next one
    await transaction.complete()
  }
}
```

## Using PowerSync: CRUD functions

Once the PowerSync instance is configured you can start using the SQLite DB functions.

The most commonly used CRUD functions to interact with your SQLite data are:

- [PowerSyncDatabase.get](/client-sdk-references/react-native-and-expo#fetching-a-single-item) - get (SELECT) a single row from a table.
- [PowerSyncDatabase.getAll](/client-sdk-references/react-native-and-expo#querying-items-powersync-getall) - get (SELECT) a set of rows from a table.
- [PowerSyncDatabase.watch](/client-sdk-references/react-native-and-expo#watching-queries-powersync-watch) - execute a read query every time source tables are modified.
- [PowerSyncDatabase.execute](/client-sdk-references/react-native-and-expo#mutations-powersync-execute) - execute a write (INSERT/UPDATE/DELETE) query.

### Fetching a Single Item

The [get](https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/PowerSyncDatabase#get) method executes a read-only (SELECT) query and returns a single result. It throws an exception if no result is found. Use [getOptional](https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/PowerSyncDatabase#getoptional) to return a single optional result (returns `null` if no result is found).

```js TodoItemWidget.jsx theme={null}
import { Text } from 'react-native'
import { powersync } from '../powersync/system'

export const TodoItemWidget = ({ id }) => {
  const [todoItem, setTodoItem] = React.useState([])
  const [error, setError] = React.useState([])

  React.useEffect(() => {
    // .get returns the first item of the result. Throws an exception if no result is found.
    powersync
      .get('SELECT * from todos WHERE id = ?', [id])
      .then(setTodoItem)
      .catch(ex => setError(ex.message))
  }, [])

  return <Text>{error || todoItem.description}</Text>
}
```

### Querying Items (PowerSync.getAll)

The [getAll](https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/PowerSyncDatabase#getall) method returns a set of rows from a table.

```js ListsWidget.jsx theme={null}
import { FlatList, Text } from 'react-native'
import { powersync } from '../powersync/system'

export const ListsWidget = () => {
  const [lists, setLists] = React.useState([])

  React.useEffect(() => {
    powersync.getAll('SELECT * from lists').then(setLists)
  }, [])

  return (
    <FlatList
      data={lists.map(list => ({ key: list.id, ...list }))}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  )
}
```

### Watching Queries (PowerSync.watch)

The [watch](https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/PowerSyncDatabase#watch) method executes a read query whenever a change to a dependent table is made. It can be used with an `AsyncGenerator`, or with a callback.

<Tabs>
  <Tab title="AsyncIterator approach">
    ```javascript  theme={null}
    async function* pendingLists(): AsyncIterable<string[]> {
      for await (const result of db.watch(
        `SELECT * FROM lists WHERE state = ?`,
        ['pending']
      )) {
        yield result.rows?._array ?? [];
      }
    } 
    ```
  </Tab>

  <Tab title="Callback approach">
    ```javascript  theme={null}
    const pendingLists = (onResult: (lists: any[]) => void): void => {
      db.watch(
        'SELECT * FROM lists WHERE state = ?',
        ['pending'],
        {
          onResult: (result: any) => {
            onResult(result.rows?._array ?? []);
          }
        }
      );
    } 
    ```
  </Tab>
</Tabs>

For advanced watch query features like incremental updates and differential results, see [Live Queries / Watch Queries](/usage/use-case-examples/watch-queries).

### Mutations (PowerSync.execute)

The [execute](https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/PowerSyncDatabase#execute) method can be used for executing single SQLite write statements.

```js ListsWidget.jsx theme={null}
import { Alert, Button, FlatList, Text, View } from 'react-native'
import { powersync } from '../powersync/system'

export const ListsWidget = () => {
  // Populate lists with one of methods listed above
  const [lists, setLists] = React.useState([])

  return (
    <View>
      <FlatList
        data={lists.map(list => ({ key: list.id, ...list }))}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button
              title="Delete"
              onPress={async () => {
                try {
                  await powersync.execute(`DELETE FROM lists WHERE id = ?`, [
                    item.id
                  ])
                  // Watched queries should automatically reload after mutation
                } catch (ex) {
                  Alert('Error', ex.message)
                }
              }}
            />
          </View>
        )}
      />
      <Button
        title="Create List"
        color="#841584"
        onPress={async () => {
          try {
            await powersync.execute(
              'INSERT INTO lists (id, created_at, name, owner_id) VALUES (uuid(), datetime(), ?, ?) RETURNING *',
              ['A list name', "[The user's uuid]"]
            )
            // Watched queries should automatically reload after mutation
          } catch (ex) {
            Alert.alert('Error', ex.message)
          }
        }}
      />
    </View>
  )
}
```

## Configure Logging

```js theme={null}
import { createBaseLogger, LogLevel } from '@powersync/react-native'

const logger = createBaseLogger()

// Configure the logger to use the default console output
logger.useDefaults()

// Set the minimum log level to DEBUG to see all log messages
// Available levels: DEBUG, INFO, WARN, ERROR, TRACE, OFF
logger.setLevel(LogLevel.DEBUG)
```

<Tip>
  Enable verbose output in the developer tools for detailed logs.
</Tip>

## Additional Usage Examples

See [Usage Examples](/client-sdk-references/react-native-and-expo/usage-examples) for further examples of the SDK.

## Developer Notes

### Connection Methods

This SDK supports two methods for streaming sync commands:

1. **WebSocket (Default)**
   - The implementation leverages RSocket for handling reactive socket streams.
   - Back-pressure is effectively managed through client-controlled command requests.
   - Sync commands are transmitted efficiently as BSON (binary) documents.
   - This method is **recommended** since it will support the future [BLOB column support](https://roadmap.powersync.com/c/88-support-for-blob-column-types) feature.

2. **HTTP Streaming (Legacy)**
   - This is the original implementation method.
   - This method will not support the future BLOB column feature.

By default, the `PowerSyncDatabase.connect()` method uses WebSocket. You can optionally specify the `connectionMethod` to override this:

```js theme={null}
// WebSocket (default)
powerSync.connect(connector)

// HTTP Streaming
powerSync.connect(connector, {
  connectionMethod: SyncStreamConnectionMethod.HTTP
})
```

### Android: Flipper network plugin for HTTP streams

**Not needed when using websockets, which is the default since `@powersync/react-native@1.11.0`.**

If you are connecting to PowerSync using HTTP streams, you require additional configuration on Android. React Native does not support streams out of the box, so we use the [polyfills mentioned](/client-sdk-references/react-native-and-expo#installation). There is currently an open [issue](https://github.com/facebook/flipper/issues/2495) where the Flipper network plugin does not allow Stream events to fire. This plugin needs to be [disabled](https://stackoverflow.com/questions/69235694/react-native-cant-connect-to-sse-in-android/69235695#69235695) in order for HTTP streams to work.

**If you are using Java (Expo \< 50):**

Uncomment the following from `android/app/src/debug/java/com/<ProjectName>/ReactNativeFlipper.java`

```js theme={null}
// NetworkFlipperPlugin networkFlipperPlugin = new NetworkFlipperPlugin();
// NetworkingModule.setCustomClientBuilder(
//     new NetworkingModule.CustomClientBuilder() {
//       @Override
//       public void apply(OkHttpClient.Builder builder) {
//         builder.addNetworkInterceptor(new FlipperOkhttpInterceptor(networkFlipperPlugin));
//       }
//     });
// client.addPlugin(networkFlipperPlugin);
```

Disable the dev client network inspector `android/gradle.properties`

```bash theme={null}
# Enable network inspector
EX_DEV_CLIENT_NETWORK_INSPECTOR=false
```

**If you are using Kotlin (Expo > 50):**

Comment out the following from `onCreate` in `android/app/src/main/java/com/<ProjectName>/example/MainApplication.kt`

```js theme={null}
// if (BuildConfig.DEBUG) {
//   ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
// }
```

### Development on iOS simulator

Testing offline mode on an iOS simulator by disabling the host machine's entire internet connection will cause the device to remain offline even after the internet connection has been restored. This issue seems to affect all network requests in an application.

## ORM Support

See [JavaScript ORM Support](/client-sdk-references/javascript-web/javascript-orm/overview) for details.

## Troubleshooting

See [Troubleshooting](/resources/troubleshooting) for pointers to debug common issues.

## Supported Platforms

See [Supported Platforms -> React Native SDK](/resources/supported-platforms#react-native-sdk).

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.powersync.com/llms.txt
