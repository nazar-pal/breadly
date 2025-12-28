# Sync Rules

PowerSync Sync Rules allow developers to control which data gets synchronized to which devices (i.e. they enable _dynamic partial replication_).

## Introduction

We recommend starting with our [Sync Rules from First Principles](https://www.powersync.com/blog/sync-rules-from-first-principles-partial-replication-to-sqlite) blog post, which explains on a high-level what Sync Rules are, why they exist and how to implement them.

The remainder of these docs dive further into the details.

<Note>
  **Sync Streams available in Early Alpha**

[Sync Streams](/usage/sync-streams) are now available in early alpha! Sync Streams will eventually replace Sync Rules and are designed to allow for more dynamic syncing, while not compromising on existing offline-first capabilities.

Key improvements in Sync Streams over Sync Rules include:

- **On-demand syncing**: You define Sync Streams on the PowerSync Service, and a client can then subscribe to them one or more times with different parameters.
- **Temporary caching-like behavior**: Each subscription includes a configurable TTL that keeps data active after your app unsubscribes, acting as a warm cache for recently accessed data.
- **Simpler developer experience**: Simplified syntax and mental model, and capabilities such as your UI components automatically managing subscriptions (for example, React hooks).

We encourage you to explore Sync Streams for new projects, and migrating to Sync Streams once they are in Beta.
</Note>

## Defining Sync Rules

Each [PowerSync Service](/architecture/powersync-service) instance has a Sync Rules configuration where Sync Rules are defined using SQL-like queries (limitations and more info [here](/usage/sync-rules/operators-and-functions)) combined together in a YAML file.
The Service uses these SQL-like queries to group data into "sync buckets" when replicating data from your backend source database to client devices.

<Frame caption="Sync rules are configured per PowerSync instance to enable partial sync.">
  <img src="https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-001.png?fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=a52f0d9c5a60c090ca5ceeca626c86dd" data-og-width="1920" width="1920" data-og-height="1080" height="1080" data-path="images/usage/sync-rules/powersync-docs-diagram-sync-rules-001.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-001.png?w=280&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=0e08d0f6b565c8bd0f0755f08780f400 280w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-001.png?w=560&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=9f8464806a74afc6533d63f6c7260450 560w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-001.png?w=840&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=41a6d70a9aea29e8a4cf2255cf2d97d9 840w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-001.png?w=1100&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=553ff4880e4a8389c9cf3018a7e91eaf 1100w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-001.png?w=1650&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=616ea95534c058c10d59d1a033267e9d 1650w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-001.png?w=2500&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=ff573922a39ee57c837c6fdec8d0dbcd 2500w" />
</Frame>

Functionality includes:

- Selecting tables/collections and columns/fields to sync.
- Filtering data according to user ID.
- Filter data with static conditions.
- Filter data with custom parameters (from [the JWT](/installation/authentication-setup) or [from clients directly](/usage/sync-rules/advanced-topics/client-parameters))
- Transforming column/field values.

## Replication Into Sync Buckets

PowerSync replicates and transforms relevant data from the backend source database according to Sync Rules.

Data from this step is persisted in separate sync buckets on the PowerSync Service. Data is incrementally updated so that sync buckets always contain current state data as well as a full history of changes.

<Frame caption="Data is replicated from the source database into sync buckets.">
  <img src="https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-002.png?fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=8b1f98e3b23967bf3c52d672ab4ed103" data-og-width="1920" width="1920" data-og-height="1080" height="1080" data-path="images/usage/sync-rules/powersync-docs-diagram-sync-rules-002.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-002.png?w=280&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=99cfe622ff951c0aafba95a3238861f0 280w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-002.png?w=560&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=62bc77622aae2c4df073ccfe9b198d1b 560w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-002.png?w=840&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=8a5d78d0e16ef04200d7930995c40ade 840w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-002.png?w=1100&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=d09f0ad77cba1031513b63712f37f36b 1100w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-002.png?w=1650&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=17dc2a056a6bf098226e06284967e890 1650w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-002.png?w=2500&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=27c3692043df280d4301ab526b5b4b42 2500w" />
</Frame>

## Client Database Hydration

PowerSync asynchronously hydrates local SQLite databases embedded in the PowerSync Client SDK based on data in sync buckets.

<Frame caption="Data flow showing sync buckets which are created based on sync rules.">
  <img src="https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-003.png?fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=86d8ea78051ea121079f48de13483dac" data-og-width="1920" width="1920" data-og-height="1080" height="1080" data-path="images/usage/sync-rules/powersync-docs-diagram-sync-rules-003.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-003.png?w=280&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=11d5641889df0d56bbfb8cd2792ba7bf 280w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-003.png?w=560&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=dc7f4cdaf9451114d69e99774c64c158 560w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-003.png?w=840&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=02b4716f716f4354a4467b3d845c433d 840w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-003.png?w=1100&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=163eee7e009bb9b5dd3af7361c8824c8 1100w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-003.png?w=1650&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=ef3135e1a7c2b3af3d9a9d5496f1ffa3 1650w, https://mintcdn.com/powersync/3jDKXjn3LiU68TOx/images/usage/sync-rules/powersync-docs-diagram-sync-rules-003.png?w=2500&fit=max&auto=format&n=3jDKXjn3LiU68TOx&q=85&s=f85f61c908f98e18254b8bca1d0771eb 2500w" />
</Frame>

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.powersync.com/llms.txt
