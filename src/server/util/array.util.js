class ArrayUtil {
  static firstNextNumber (array) {
    array.sort((a, b) => {
      return a - b;
    });

    for (let i = 1; i <= array.length; i++) {
      if (!array.includes(i)) {
        return i;
      }
    }
    return array[array.length - 1] + 1;
  }
}

module.exports = ArrayUtil;
