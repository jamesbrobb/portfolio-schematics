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
import {DefinitionType} from "../helpers/definitions/class";
import {ComponentMetadata, DirectiveMetadata} from "../helpers/ng/ng-decorators";
import {getInputs, getOutputs, getPublicProperties} from "../helpers/ng/ng-helpers";
import {getPublicMethodSignatures} from "../helpers/definitions/method";



export default function (options: Schema): Rule {

  return  (tree: Tree, _context: SchematicContext) => {

    const rules: Rule[] = [];

    if (!tree.exists(options.componentFilePath)) {
      throw new FileDoesNotExistException(options.componentFilePath);
    }

    const path = options.componentFilePath.split('/').slice(0, -1).join('/'),
      classDec = getClassDeclarationFromFile(options.componentFilePath),
      heritageClauses = classDec[DefinitionType.HeritageClause],
      decorator = classDec[DefinitionType.Decorator],
      properties = classDec[DefinitionType.PropertyDeclaration],
      methods = classDec[DefinitionType.MethodDeclaration];
      //getAccessors = classDec[DefinitionType.GetAccessor],
      //setAccessors = classDec[DefinitionType.SetAccessor];

    //console.log(classDec);

    if (!decorator) {
      throw new Error(`No @Component decorator found in ${options.componentFilePath}`);
    }

    const metadata: DirectiveMetadata | ComponentMetadata = decorator.metadata as DirectiveMetadata | ComponentMetadata;

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: classDec[DefinitionType.Identifier] || 'Component',
        selector: metadata.selector,
        standalone: metadata.standalone,
        inputs: getInputs(properties),
        outputs: getOutputs(properties),
        properties: getPublicProperties(properties),
        methods: getPublicMethodSignatures(methods),
        implements: heritageClauses.filter(clause => clause.keyword === 'implements').map(clause => clause.types),
        extendss: heritageClauses.filter(clause => clause.keyword === 'extends').map(clause => clause.types),
      }),
      move(normalize(`${path}/.README`))
    ]);

    rules.push(mergeWith(templateSource, MergeStrategy.Overwrite));

    return chain(rules);
  }
}
