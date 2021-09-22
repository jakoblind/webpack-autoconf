import _ from 'lodash';
import projectGenerator from './project-generator';

test('React project', () => {
  const project = projectGenerator(['React']);

  expect(project['.babelrc']).not.toBeNull();
  expect(_.size(project)).toBe(7);
});

test('Vue project', () => {
  const project = projectGenerator(['vue']);

  expect(project['src/App.vue']).toBeDefined();
  expect(_.size(project)).toBe(7);

  const projectWithTypescript = projectGenerator(['vue', 'typescript']);

  expect(projectWithTypescript['vue-shim.d.ts']).toBeDefined();
  expect(_.size(projectWithTypescript)).toBe(9);
});

test('Empty project', () => {
  const project = projectGenerator([]);

  expect(_.size(project)).toBe(6);
});
