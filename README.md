# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

### Running

To run schematic:

1) Build and copy files
2) Create symlink in the project (where you wish to run the schematic) `node_modules`
3) Run schematic

```bash
npm run build
npm link dist/libraries/@jbr/schematics
ng g @jbr/schematics:readme
```

# Important stuff to remember...

### When using the global `schematics` command (which uses the global `@angular-devkit/schematics`)

__ONLY__ ever use it to run schematics if:

1) They __do not__ need to know the workspace root
2) They __do not__ require a Workspace
3) They require a Workspace but the CWD is the Workspace root

For the following reasons:

1) The workspace root is set as the CWD, so the `tree: Tree` root is the CWD. So if the `tree` is used at all and its root is expected to be the Workspace root, you'll get unexpected behaviour.
2) `"$source": "workingDirectory"` used as a default is `undefined` - i.e for `"path"`
3) `"$source": "projectName"` used as a default is also `undefined`
4) `const workspaceConfig = tree.read('./angular.json');` will be `null` unless executed in the workspace root

This can be seen if you do the following within the factory function:

```js
const dir = tree.getDir('/');
console.log(dir);
```

For `schematics my:schematic` you will see:

```bash
HostDirEntry {
  parent: null,
  path: '/',
  _host: SyncDelegateHost {
    ...
  },
  _tree: HostTree {
    _backend: ScopedHost {
      _delegate: NodeJsSyncHost {},
      _root: '/Absolute/path/of/CWD'
    },
    ...
  }
}
```

Where as for `ng generate my:schematic` you will see:

```bash
HostDirEntry {
  parent: null,
  path: '/',
  _host: SyncDelegateHost {
    ...
  },
  _tree: HostTree {
    _backend: ScopedHost {
      _delegate: NodeJsSyncHost {},
      _root: '/Absolute/path/of/workspace/root'
    },
    ...
  }
}
```


### When using `ng generate my:schematic`

__DO NOT__ execute them in the workspace root as default arg values are `undefined`.

If you have an optional "path" property set the default to get the cwd. The path returned is relative to the workspace root.

```json
{
    "path": {
        "type": "string",
        "format": "path",
        "$default": {
            "$source": "workingDirectory"
        },
        "description": "The path at which to create the component file, relative to the current workspace. Default is the cwd relative to the current workspace",
        "visible": false
    }
}
```

```bash
ng generate my:schematic
```
1) `path` defaults to cwd relative to workspace
2) `tree.getDir('/')` is the root dir of the workspace

But if you run it using the global

```bash
schematics my:schematic
```
1) `path` default is `undefined`
2) `tree.getDir('/')` is the cwd
