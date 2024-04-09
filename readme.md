# `register-github-app-cli`

> CLI to register a GitHub App using the manifest flow

## Usage

```
$ npx register-github-app-cli --help

  Usage
    $ register-github-app-cli

  Options
    --manifest Path to YAML or JSON manifest file
    --org Set organization login

  Examples
    $ register-github-app-cli
    # register app with no events or permissions on user account
    $ register-github-app-cli --org my-org --manifest app.yml
    # registers app on github.com/my-org using settings from app.yml
```

Both `.yml`/`.yaml` and `.json` files are supported. Supported keys are documented at https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest#github-app-manifest-parameters.

## See also

- https://github.com/gr2m/register-github-app - method to register a GitHub API using the manifest flow

## License

[ISC](license)
