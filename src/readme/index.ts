import {
    apply,
    applyTemplates,
    mergeWith,
    move,
    Rule,
    SchematicContext,
    Tree,
    url
} from "@angular-devkit/schematics";

import {Schema} from "./schema";
import {normalize, strings} from "@angular-devkit/core";
import {capitalize} from "@angular-devkit/core/src/utils/strings";
import {getWorkspace as getWS} from "@schematics/angular/utility/workspace";
import {WorkspaceDefinition} from "@angular-devkit/core/src/workspace";


export function createReadme(options: Schema): Rule {
    return async (tree: Tree, _context: SchematicContext) => {

        if(!options.path) {
            await getWorkspace(tree);
        }

        const path = options.path || '.',
          dir = tree.getDir(path),
          parts = path.split('/'),
          name = parts[parts.length - 1]
            .split('-')
            .map(word => capitalize(word))
            .join(' ');

        dir.subfiles.forEach(file => {
            console.log(file);
        })

        const templateSource = apply(url('./files'), [
            applyTemplates({
                classify: strings.classify,
                dasherize: strings.dasherize,
                name: name
            }),
            move(normalize(`${path}/.README`))
        ]);

        return mergeWith(templateSource);
    }
}


async function getWorkspace(tree: Tree): Promise<WorkspaceDefinition | undefined> {

    let ws: WorkspaceDefinition | undefined = undefined;

    try {
        ws = await getWS(tree);
    } catch(e) {
        throw Error(`${e.message}\nThis can be caused when using the global 'schematics' command instead of 'ng generate`);
    }

    return ws;
}



/*function getWorkspacePath(tree: Tree): string {
    const workspaceConfig = tree.read('./angular.json');

    if (workspaceConfig) {
        const workspaceContent = workspaceConfig.toString();
        //console.log('workspaceContent::', workspaceContent);

        const workspace: WorkspaceSchema = JSON.parse(workspaceContent);
        console.log('workspace', workspace);
        console.log(workspace.defaultProject);
        console.log(workspace.projects);
        console.log(workspace);
    }

    return ''
}*/
