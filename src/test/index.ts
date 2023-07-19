import {
    apply,
    applyTemplates, chain,
    FileDoesNotExistException, MergeStrategy, mergeWith, move,
    Rule,
    SchematicContext,
    Tree,
    url
} from "@angular-devkit/schematics";
import {Schema} from "./schema";
import {dirname, basename} from "path";
import {normalize, PathFragment, strings} from "@angular-devkit/core";


function getExampleHtml(tree: Tree, dirPath: string): string | undefined {

    const exampleHtmlPath = normalize(`${dirPath}/EXAMPLE.html`);

    if(!tree.exists(exampleHtmlPath)) {
        throw new FileDoesNotExistException(exampleHtmlPath);
    }

    const buffer = tree.read(exampleHtmlPath);

    return buffer?.toString();
}

function getExampleCss(tree: Tree, dirPath: string): string | undefined {

    const exampleCssPath = normalize(`${dirPath}/EXAMPLE.scss`);

    if(!tree.exists(exampleCssPath)) {
        console.warn(`File: ${exampleCssPath} not found.`)
    }

    const buffer = tree.read(exampleCssPath);

    return buffer?.toString();
}

function createDynamicModuleMap(tree: Tree, path: string): [PathFragment, string][] {

    const map: [PathFragment, string][] = [];

    tree.getDir(path).subdirs.forEach((dirName) => {

        const filePath = `${dirName}/${dirName}-example.component`;

        if(!tree.exists(normalize(`${path}/${filePath}.ts`))) {
            return;
        }

        map.push([dirName, `./${normalize(filePath)}`]);
    });

    return map;
}


export function test(options: Schema): Rule {

    console.log(options);
    return (tree: Tree, _context: SchematicContext) => {

        if (!tree.exists(options.componentFilePath)) {
            throw new FileDoesNotExistException(options.componentFilePath);
        }

        const dirPath = normalize(`${dirname(options.componentFilePath)}/.README/`),
            outputName = basename(options.componentFilePath).split('.')[0],
            html = getExampleHtml(tree, dirPath),
            css = getExampleCss(tree, dirPath),
            rules: Rule[] = [];

        const templateSource = apply(url('./files/component'), [
            applyTemplates({
                classify: strings.classify,
                dasherize: strings.dasherize,
                name: outputName,
                html: html,
                css: css ? true : false
            }),
            move(normalize(`${options.outputPath}/${outputName}/`))
        ]);

        rules.push(mergeWith(templateSource));

        if (css) {

            const cssSource = apply(url('./files/styles'), [
                applyTemplates({
                    dasherize: strings.dasherize,
                    name: outputName,
                    css: css
                }),
                move(normalize(`${options.outputPath}/${outputName}/`))
            ]);

            rules.push(mergeWith(cssSource));
        }

        const moduleSource = apply(url('./files/module'), [
            applyTemplates({
                entries: createDynamicModuleMap(tree, options.outputPath),
                classify: strings.classify
            }),
            move(normalize(options.outputPath))
        ]);

        rules.push(mergeWith(moduleSource, MergeStrategy.Overwrite));

        return chain(rules);
    }
}
