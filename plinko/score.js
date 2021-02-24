const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  let testSetSize = 100;
  
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  
  _.range(1, 20).forEach(k => {
    // take the testPoint without the bucket 
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();
    
    console.log('For k of ', k, ' accuracy is ', accuracy); 
  });
}

function knn(data, point, k) {
  // point has 3 values
  return _.chain(data)
    .map(row => [distance(_.initial(row), point), _.last(row[3])])
      .sortBy(row => row[0])
      .countBy(row => row[1])
      .toPairs()
      .sortBy(row => row[1])
      .last()
      .first()
      .parseInt()
      .value();
}

function distance(pointA, pointB) {
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value()
	
}

function splitDataset(data, testCount) {
  const shuffledData = _.shuffle(data);
  
  // take data from 0 t0 testCount
  const testSet = _.slice(shuffledData, 0, testCount);
  // take data from testCount till the end
  const trainingSet = _.slice(shuffledData, testCount);
  
  return [testSet, trainingSet];
}