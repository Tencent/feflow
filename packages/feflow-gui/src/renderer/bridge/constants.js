import os from 'os'
import path from 'path'

export const OS_HOME = os.homedir()

export const FEFLOW_HOME_NAME = '.fef'

export const FEFLOW_CONFIG_NAME = '.feflowrc.yml'

export const DEFAULT_WORKSPACE = path.resolve(OS_HOME, FEFLOW_HOME_NAME, 'workspace')

export const FEFLOW_GENERATOR_REGEX = /^@(tencent|feflow)\/generator-(.*)/i

export const FEFLOW_HOME_PATH = path.resolve(OS_HOME, FEFLOW_HOME_NAME)

export const FEFLOW_HOME_CONFIG_PATH = path.resolve(FEFLOW_HOME_PATH, FEFLOW_CONFIG_NAME)

export const FEFLOW_HOME_PACKAGE_PATH = path.resolve(OS_HOME, FEFLOW_HOME_NAME, './package.json')

export const GENERATOR_CONFIG_FILE_NAME = ['generator.js', 'generator.json']

export const CREATE_CODE = {
  // Native code
  SUCCESS: 0,
  COMMAND_NOT_FOUND: 127,
  INNER_ERROR: 7,

  // Custom code
  INITIAL: 1,
  CHECK_SUCCESS: 2,
  INVALID_WORKSPACE: 10002,
  INVALID_WORKSPACE_NOT_EMPTY: 10003,
  EMPTY_GENERATOR: 10004,
  TIMEOUT: 10005
}
