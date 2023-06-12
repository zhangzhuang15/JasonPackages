# JasonPackages

my npm packages in mono-repo

## mono-repo

To start a mono-repo project with `lerna` + `pnpm`:

1. make sure you install `lerna` and `pnpm`;
2. create your project directory and `cd` in；
3. run `pnpm init`;
4. create `pnpm-workspace.yaml`, and set which directory your packages locate in:

   ```yaml
   packages:
     - "packages/*"
     - "example/*"
   # the directories under <project root directory>/packages and <project root directory>/example are considered as your packages of mono-repo.
   ```

5. run `lerna init`
6. make sure your `lerna.json`:
   - "useWorkspaces" is true
   - "npmClient" is "pnpm"
7. create your directory which contains your mono-repo packages
8. develop your package
9. run the script of packages' `package.json` with `lerna`:

   ```sh
   lerna run bundle-dev --scope="@pyq/tql"

   ## @pyq/tql is your package name, not directory name.
   ```

10. manage your package dependencies with `pnpm`
    > when use pnpm and lerna together, lerna will
    > block `link` `add` `bootstrap` command, so
    > you cannot install dependencies with lerna
