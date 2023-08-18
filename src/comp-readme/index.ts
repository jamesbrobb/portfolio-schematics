import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  FileDoesNotExistException,
  apply,
  applyTemplates,
  move,
  url,
  mergeWith,
  MergeStrategy
} from '@angular-devkit/schematics';
import {normalize, strings} from "@angular-devkit/core";
import {Schema} from "./schema";
import {getClassDeclarationFromFile} from "../helpers/utilities";
import {ComponentMetaData, DirectiveMetaData} from "../helpers/ng/ng-decorators";
import {getInputs, getOutputs, getPublicProperties} from "../helpers/ng/ng-helpers";
import {getPublicMethodSignatures} from "../helpers/definitions/method";
import {getHeritageClausesByType} from "../helpers/definitions/heritage";
import {dasherize} from "@angular-devkit/core/src/utils/strings";



export default function (options: Schema): Rule {

  return  (tree: Tree, _context: SchematicContext) => {

    const rules: Rule[] = [];

    if (!tree.exists(options.componentFilePath)) {
      throw new FileDoesNotExistException(options.componentFilePath);
    }

    const outputPath = options.componentFilePath.split('/').slice(0, -1).join('/'),
      outputName = options.componentFilePath.split('/').pop()?.replace('.ts', ''),
      classDec = getClassDeclarationFromFile(options.componentFilePath),
      heritageClauses = classDec.heritage,
      decorator = classDec.decorator,
      properties = classDec.property,
      methods = classDec.method;
      //getAccessors = classDec.getter,
      //setAccessors = classDec.setter;

    if (!decorator) {
      throw new Error(`No @Component decorator found in ${options.componentFilePath}`);
    }

    const type = decorator.type,
      name = classDec.name || 'No name found',
      metadata: DirectiveMetaData | ComponentMetaData = decorator.metadata as DirectiveMetaData | ComponentMetaData;

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        type,
        name: name.replace(type, ''),
        outputName: outputName || dasherize(name),
        selector: metadata.selector,
        standalone: metadata.standalone,
        inputs: getInputs(properties),
        outputs: getOutputs(properties),
        properties: getPublicProperties(properties),
        methods: getPublicMethodSignatures(methods),
        implements: getHeritageClausesByType('implements', heritageClauses),
        extendss: getHeritageClausesByType('extends', heritageClauses),
      }),
      move(normalize(`${outputPath}/.README`))
    ]);

    rules.push(mergeWith(templateSource, MergeStrategy.Overwrite));

    return chain(rules);
  }
}
