/**
 * 以下内容由feflow eject自动生成
 */
const builder = require('./index');
const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'development') {
  builder('dev');
} else {
  builder('build');
}