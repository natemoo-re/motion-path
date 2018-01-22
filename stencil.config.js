exports.config = {
  namespace: 'mycomponent',
  generateDistribution: true,
  bundles: [
    { components: ['motion-path'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
