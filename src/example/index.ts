import {
  apply,
  applyTemplates, chain, mergeWith, move,
  Rule,
  SchematicContext,
  FileDoesNotExistException,
  Tree,
  url, MergeStrategy
} from '@angular-devkit/schematics';
import {Schema} from "./schema";
import {normalize, PathFragment, strings} from "@angular-devkit/core";



function getTargetPath(options: Schema): string {

  if(options.targetPath && !options.usePwd) {
    return options.targetPath;
  }

  return options.path;
}

function getExampleHtml(tree: Tree, options: Schema): string | undefined {

  const exampleHtmlPath = normalize(`/${options.examplesPath}/${options.selector}/${options.selector}-example.html`);

  if(!tree.exists(exampleHtmlPath)) {
    throw new FileDoesNotExistException(`No example html file found for ${options.selector}: ${exampleHtmlPath}`);
  }

  const buffer = tree.read(exampleHtmlPath);

  return buffer?.toString();
}

function createDynamicModuleMap(tree: Tree, path: string): [PathFragment, string][] {

  const map: [PathFragment, string][] = [];
  console.log('path', path);

  tree.getDir(path).subdirs.forEach((dirName) => {

    const filePath = `${dirName}/${dirName}-example.component`;

    if(!tree.exists(normalize(`${path}/${filePath}.ts`))) {
      return;
    }

    map.push([dirName, `./${normalize(filePath)}`]);
  });
  console.log(map);
  return map;
}

export function createExample(options: Schema): Rule {
  console.log('options',options)
  return async (tree: Tree, _context: SchematicContext) => {

    const html = getExampleHtml(tree, options)?.trim(),
        path = normalize(getTargetPath(options));

    const templateSource = apply(url('./files/component'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.selector,
        selector: options.selector,
        html: html
      }),
      move(normalize(`${path}/${(options.flat ? '' : options.selector + '/')}`))
    ]);

    const moduleSource = apply(url('./files/module'), [
      applyTemplates({
        entries: createDynamicModuleMap(tree, path),
        classify: strings.classify
      }),
      move(normalize(path))
    ]);

    return chain([
      mergeWith(templateSource),
      mergeWith(moduleSource, MergeStrategy.Overwrite)
    ]);
  };
}
