const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'category_name'],
      include: [
        {
          model: Product,
          attributes: ['id','product_name']
        },
       
      ]
    })
    res.json(categories);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async(req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'category_name'],
      include: [
        {
          model: Product,
          attributes: ['id','product_name']
        },
       
      ]
    })
    res.json(category);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new category
    const category = await Category.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const categoryTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          category_id: category.id,
          tag_id: tag_id,
        };
      });

      // Create category-tag relationships (through ProductTag)
      await ProductTag.bulkCreate(categoryTagIdArr);
    }

    // Respond with the created category
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});


router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryId = req.params.id;
    const updatedCategory = await Category.update(req.body, {
      where: { id: categoryId } // Specify the where clause to identify the record
    });
    
    if (updatedCategory[0] === 0) {
      // If no rows were updated (category with given id not found)
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json(error);
  }
});


router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
