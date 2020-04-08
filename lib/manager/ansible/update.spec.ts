import { readFileSync } from 'fs';
import updateDependency from './update';

const yamlFile1 = readFileSync(
  'lib/manager/ansible/__fixtures__/main1.yaml',
  'utf8'
);
const yamlFile2 = readFileSync(
  'lib/manager/ansible/__fixtures__/main2.yaml',
  'utf8'
);

describe('manager/ansible/update', () => {
  describe('updateDependency', () => {
    it('replaces existing value from docker_container', () => {
      const upgrade = {
        managerData: { lineNumber: 4 },
        depName: 'busybox',
        newValue: '1.29.3',
        newDigest: 'sha256:abcdefghijklmnop',
      };
      const res = updateDependency({ fileContent: yamlFile1, upgrade });
      expect(res).not.toEqual(yamlFile1);
      expect(res.includes(upgrade.newDigest)).toContain(true);
    });
    it('replaces existing value from docker_service', () => {
      const upgrade = {
        managerData: { lineNumber: 8 },
        depName: 'sameersbn/gitlab',
        newValue: '11.5.1',
        newDigest: 'sha256:abcdefghijklmnop',
      };
      const res = updateDependency({ fileContent: yamlFile2, upgrade });
      expect(res).not.toEqual(yamlFile2);
      expect(res.includes(upgrade.newDigest)).toContain(true);
    });
    it('returns same', () => {
      const upgrade = {
        managerData: { lineNumber: 38 },
        depName: 'sameersbn/redis',
        newValue: '4.0.9-1',
      };
      const res = updateDependency({ fileContent: yamlFile2, upgrade });
      expect(res).toEqual(yamlFile2);
    });
    it('returns null if mismatch', () => {
      const upgrade = {
        managerData: { lineNumber: 52 },
        newFrom: 'registry:2.6.2@sha256:abcdefghijklmnop',
      };
      const res = updateDependency({ fileContent: yamlFile2, upgrade });
      expect(res).toBeNull();
    });
    it('returns null if error', () => {
      const res = updateDependency({ fileContent: null, upgrade: null });
      expect(res).toBeNull();
    });
  });
});
