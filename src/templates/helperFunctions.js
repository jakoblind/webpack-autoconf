import _ from 'lodash';

export const joinToString = list =>
  _.reduce(list, (all, i) => `${all + i}\n`, '');
