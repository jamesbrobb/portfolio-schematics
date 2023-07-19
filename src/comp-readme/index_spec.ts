import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

// SchematicTestRunner needs an absolute path to the collection to test.
const collectionPath = path.join(__dirname, '../collection.json');

describe('my-full-schematic', () => {
  it('requires required option', async () => {
    // We test that
    const runner = new SchematicTestRunner('schematics', collectionPath);
    await expectAsync(
      runner.runSchematicAsync('my-full-schematic', {}, Tree.empty())
    ).toBeRejected();
  });
});
