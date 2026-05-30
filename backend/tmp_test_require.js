try {
  require('./utils/finance');
  console.log('finance loaded');
} catch (e) {
  console.error('load error', e);
}
