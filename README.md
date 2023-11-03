# Jymmin Rehab (rehab-cycling)

An app for rehab cycling use cases with Jymmin.

## Install the dependencies
```bash
yarn
```

### Starting the app
Start dev server in a separate shell:
```bash
yarn dev
```

Start tauri backend:
```bash
yarn tauri dev
```


### Build the app for production
Set the `TAURI_PRIVATE_KEY` and `TAURI_KEY_PASSWORD` environment variables. 
`TAURI_PRIVATE_KEY` should be the path to this app's private key
and `TAURI_KEY_PASSWORD` the key's password.

Then run 
```bash
# for dev channel release
yarn build-dev
# for preview channel release
yarn build-preview
# for staging channel release
yarn build-staging
# for production channel release
yarn build-production
```

### Customize the quasar configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### Customize tauri config
Edit src-tauri/tauri.config.json and see [tauri config help](https://tauri.studio/docs/api/config#tauri).