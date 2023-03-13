# Cloudflare

The Cloudflare infrastructure of Version Check.

This API fetches and returns the latest published version for Ganache and Truffle and provides an analytics endpoint for reporting.

## **Requirements**

Cloudflare requires you to have a Cloudflare account and complete a number of additional setup and configuration steps to begin development. These steps mirror the steps taken to setup the production environment. If you fork this repo and complete these steps you will have your own staging/testing environment on a free Worker tier.

1. [Create a Cloudflare Account](https://workers.cloudflare.com/)
2. [Configure Cloudflare](#configure-cloudflare)
3. [Configure Github deployments](#configure-github-deployments)
4. [Publish the Worker]()
5. [Setup local development](#setup-local-development)

### **Configure Cloudflare**

You will need to obtain your Account ID, create an API Token, create a Worker and a KV Namespace from your Cloudflare Dashboard.

1. [Login to your Cloudflare Account](https://workers.cloudflare.com/)
2. [Create an API Token](https://dash.cloudflare.com/profile/api-tokens) - Default permissions should be fine.
3. [Get your Account ID](https://dash.cloudflare.com/) This is found on the right side of Workers > Overview
4. [Install Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) Follow the instructions, login with your account.
5. [Create a KV Namespace](#create-a-kv-namespace)
6. [Create ENV Variables](#create-env-variables)

### **Gotcha's, Lessons Learned**

You cannot use vscode to debug the locally running wrangler instance in your dev environment. The `wrangler dev` command runs a copy of a production env worker on your dev machine.

You can use the same KV Store Name for a dev environment. Any KV values created in `wrangler dev` will be deleted after stopping `wrangler`. A production KV can be used in a development environment and production infrastructure will ignore records created in a dev environment. However, during development the ephemeral records created during dev will cohabitate with production records. Both sets of records will be available in development. While in dev, KV key collisions do not impact production data.

#### **Create a KV Namespace**

Using the Wrangler cli tool, run

```sh
$ wrangler kv:namespace create VERSION_DATA --preview
```

Copy the value for `preview_id` into the `preview_id` property of `kv_namespaces` in `wrangler.toml`

```sh
$ wrangler kv:namespace create VERSION_DATA
```

Copy the value for `id` into the `id` property of `kv_namespaces` in `wrangler.toml`

These values are safe to make public. Wrangler will create and bind these key value stores to this worker and they will be available at runtime. You can see these KV Namespaces in your Cloudflare Dashboard.

#### **Create ENV Variables**

1. In your Worker Dashboard, goto Settings > Variables -> Edit Variables and create the following variables:

```
ADMIN_PASSWORD
ADMIN_USERNAME
SALT
```

Give them values and select to encrypt them.

<p align=center>⚠️**WARNING**⚠️</p>

If these vars are set in `wrangler.toml` Wrangler cli will overwrite the encrypted values set in the dashboard. Additionally, any plaintext variable set in the dashboard will be removed if it does not exist in `wrangler.toml`

Never add the ENV vars to the `wrangler.toml` directly. If they are published as plaintext vars, then removed from the `wrangler.toml` and published again the ENV vars set here are deleted.

<p align=center>⚠️**WARNING**⚠️</p>

2. Create a `.dev.vars` file and add the following variables:

```sh
ADMIN_USERNAME = ""
ADMIN_PASSWORD = ""
SALT = ""
```

Your local Wrangler will use the values set in `.dev.vars`

### **Configure Github deployments**

The `deploy.yml` github workflow will automatically deploy Worker changes on a push/merge to `master`.

#### **Create Github Secrets**

In your repository goto Settings > Secrets -> Actions and click 'New repository secret'.

Using the API Token and Account id from [Configure Cloudflare](#configure-cloudflare), create secrets for `CF_API_TOKEN` and `CF_ACCOUNT_ID`.

### **Publish the Worker**

Run:

```sh
$ wrangler publish
```

If successful,

```sh
 ⛅️ wrangler 2.0.24 (update available 2.0.27)
-------------------------------------------------------
Retrieving cached values for userId from node_modules/.cache/wrangler
Your worker has access to the following bindings:
- Durable Objects:
  - ANALYTICS: Analytics
- KV Namespaces:
  - VERSION_DATA: 0bf4ebbf4d5a4fd3b1b4c4991fdcdf2a
Total Upload: 8.61 KiB / gzip: 2.75 KiB
Uploaded version-check (1.15 sec)
Published version-check (0.22 sec)
  https://version-check.[YOURUSERNAME].workers.dev

```

You are now running on `https://version-check.[YOURUSERNAME].workers.dev`

### **Setup local development**

Run:
`$ wrangler dev`

If successful,

```sh
 ⛅️ wrangler 2.0.24 (update available 2.0.27)
-------------------------------------------------------
Retrieving cached values for userId from node_modules/.cache/wrangler
Using vars defined in .dev.vars
Your worker has access to the following bindings:
- Durable Objects:
  - ANALYTICS: Analytics
- KV Namespaces:
  - VERSION_DATA: e52fba7b7c214f2395019fefb611172d
- Vars:
  - ADMIN_USERNAME: "(hidden)"
  - ADMIN_PASSWORD: "(hidden)"
  - SALT: "(hidden)"
⬣ Listening at http://localhost:8787
```

### **References**

The server is a [Cloudflare Worker](https://workers.cloudflare.com/).

Analytics are a [Durable Object](https://developers.cloudflare.com/workers/learning/using-durable-objects/)
