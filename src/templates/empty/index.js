import { joinToString } from '../helperFunctions';

export const emptyIndexJs = (extraImports = []) =>
  `${joinToString(extraImports)}console.log("hello world!");`;
