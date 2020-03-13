/**
 * 全局配置
 */
import devConfig from '@/config/dev';
import prodConfig from '@/config/prod';

let config = process.env.NODE_ENV !== 'production' ? devConfig : prodConfig;

Object.assign(config, {
    project: 'weadmin',
    name: '可视化构建工具',
    url: 'http://dev.mmgame.oa.com/',
    // site    : {}
    // mock    : {}

    pagination: {
        pageSize: 10
    }
});

export default config
