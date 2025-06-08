/**
 * 删除空的子节点
 */
export function removeEmptyChildren(data, key = 'children') {
  // 检查数据是否为有效数组
  if (!Array.isArray(data)) {
    return data || []
  }

  for (const v of data) {
    // 检查对象是否存在以及是否有子节点属性
    if (v && typeof v === 'object' && v[key]) {
      if (Array.isArray(v[key]) && v[key].length > 0) {
        removeEmptyChildren(v[key], key)
      } else {
        delete v[key]
      }
    }
  }
  return data
}

function dumpData(categories, parentId, allData) {
  categories.forEach((category) => {
    const categoryData = {
      category_id: category.category_id,
      categories_name: category.categories_name,
      parent_id: parentId,
    }

    allData.push(categoryData)

    if (category.children.length > 0) {
      dumpData(category.children, category.category_id, allData)
    }
  })
}

// 导出的函数，将数据转储到数组对象中
export function dumpCategoriesData(data) {
  const allData = []

  dumpData(data, null, allData)

  return allData
}
