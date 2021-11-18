# ProjectIt-template

An empty template for a project using <a href="www.projectit.org">ProjectIt</a>. The template
project provides a shell for the generated editor that enables the user to work with multiple models and
model units.

For an explanation of the content of the project see
<a href="https://www.projectit.org//020_Getting_Started/020_Project_Structure" target="_blank">
Project Structure</a>.

## Getting started

In the following the root of the project will be indicated with '~'.

*   Clone or copy branch `master`.
    
*   Next, install all necessary packages by running:
    ```bash
    yarn install
    ```

*   Create a folder for your language in `~/src`, to hold the definition files for your language.
    We usually call it *defs*, but any name will do. (Here the name *defs* will be used.)

*	Create a language definition file which defines the structure of your language. The
     extension of this file must be `.ast`. You can, for instance, copy
     `EntityLanguage.ast` from the ProjectIt example to your own `defs`-folder. Or, you can follow the
     tutorial on [language structure definition](/030_Developing_a_Language/010_Default_Level).

> Note: Only the language structure is required. Defaults will be generated for the 
> editor, scoper, typer, and validator. This is called the first level of customization.

*   Next, adjust the `scripts` entry in the *package.json* file. The `generate`
    script should include your *defs* folder as well as the folder where you want the
    generated code to be stored.

*   Run the generator and see the generated files appearing in the folder where you
    decided to store the generated code:

```bash
    yarn generate
```

*   Adjust the configuration of the web application by changing the two lines in the file
    `~/src/webapp/WebappConfiguration.ts`.

*   Start the server (note that anything that is saved in the editor will be stored in `~/modelstore`):
    ```bash
    yarn model-server
    ```

*	Open another (bash) terminal, and start the generated editor from it:
     ```bash
     yarn dev
     ```

> The last command opens your preferred browser with the generated editor for the language
>    `Entity` on `http://localhost:3000/`. 
>    If Chrome is not your preferred browser, please open the above page in Chrome, because we 
>    cannot ensure that the editor functions as it should in other browsers.

*   Try out the editor

> If you are having trouble using the editor, have a look at the key-bindings under the *Help* menu.
