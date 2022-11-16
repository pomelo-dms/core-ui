const rightMenu = {
    level0_db: [
        {id: 'createDatabase', type: 1, title: '新建数据库', divider: false,},
        {id: 'updateDatabase', type: 1, title: '修改数据库', divider: false,},
        {id: 'dropDatabase', type: 1, title: '删除数据库', divider: true,},
        {id: 'createTable', type: 1, title: '创建表', divider: false,},
        {id: 'createView', type: 1, title: '创建视图', divider: false,},
        {id: 'createProcedure', type: 1, title: '创建存储过程', divider: false,},
        {id: 'exportData', type: 1, title: '数据导出', divider: false,},
        {id: 'exportTableStructure', type: 1, title: '表结构导出', divider: false,},
        {id: 'openSQLConsole', type: 1, title: 'SQL 控制台', divider: true,},
        {id: 'refreshDatabase', type: 1, title: '刷新', divider: false,},
        {id: 'databaseInfo', type: 1, title: '对象信息', divider: false,},
    ],
    level1_t: [
        {id: 'createTable', type: 2, title: '新建表', divider: false,},
        {id: 'refreshTable', type: 2, title: '刷新', divider: false,},
    ],
    level1_v: [
        {id: 'createView', type: 3, title: '新建视图', divider: false,},
        {id: 'refreshView', type: 3, title: '刷新', divider: false,},
    ],
    level1_p: [
        {id: 'createProcedure', type: 4, title: '新建存储过程', divider: false,},
        {id: 'refreshProcedure', type: 4, title: '刷新', divider: false,},
    ],
    level2_t: [
        {id: 'openTable', type: 5, title: '打开表', divider: false,},
        {id: 'importData', type: 5, title: '导入数据', divider: false,},
        {id: 'exportData', type: 5, title: '导出表数据', divider: true,},
        {id: 'createTable', type: 5, title: '创建表', divider: false,},
        {id: 'copyTable', type: 5, title: '复制表', divider: false,},
        {id: 'alterTable', type: 5, title: '修改表', divider: false,},
        {id: 'dropTable', type: 5, title: '删除表', divider: false,},
        {id: 'truncationTable', type: 5, title: '截断表', divider: true,},
        {id: 'tableInfo', type: 5, title: '对象信息', divider: false,},
        {id: 'tableSqlScript', type: 5, title: '生成 SQL 脚本', divider: false,},
    ],
    level2_v: [
        {id: 'showViewData', type: 6, title: '查看视图数据', divider: false,},
        {id: 'exportViewData', type: 6, title: '视图数据导出', divider: true,},
        {id: 'createView', type: 6, title: '新建视图', divider: false,},
        {id: 'updateView', type: 6, title: '修改视图', divider: false,},
        {id: 'dropView', type: 6, title: '删除视图', divider: true,},
        {id: 'viewInfo', type: 6, title: '对象信息', divider: false,},
    ],
    level2_p: [
        {id: 'showProcedure', type: 7, title: '查看存储过程', divider: false,},
        {id: 'createProcedure', type: 7, title: '新建存储过程', divider: false,},
        {id: 'dropProcedure', type: 7, title: '删除存储过程', divider: true,},
        {id: 'procedureInfo', type: 7, title: '对象信息', divider: false,},
    ]
}
export default rightMenu