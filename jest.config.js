module.exports = {
    testEnvironment: 'node',
    reporters : [
        'default',
        ['jest-stare', {
            resultDir: 'jest-stare',
            reportTitle: 'Relatório de Testes',
            addtionalResultsProcessors: ['jest-html-reporter']
        }]
    ]
}