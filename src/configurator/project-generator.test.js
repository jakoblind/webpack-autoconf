import projectGenerator from './project-generator'
import _ from 'lodash'

test('React project', () => {
  const project = projectGenerator(['React'])

  expect(project['.babelrc']).not.toBeNull()
  expect(_.size(project)).toBe(6)
})

test('Vue project', () => {
  const project = projectGenerator(['Vue'])

  expect(project['src/App.vue']).toBeDefined()
  expect(_.size(project)).toBe(6)

  const projectWithTypescript = projectGenerator(['Vue', 'Typescript'])

  expect(projectWithTypescript['vue-shim.d.ts']).toBeDefined()
  expect(_.size(projectWithTypescript)).toBe(8)
})

test('Empty project', () => {
  const project = projectGenerator([])

  expect(_.size(project)).toBe(5)
})
