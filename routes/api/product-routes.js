const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// find all products including their associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name']
        },
      ]
    })
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }

});
// find a single product by its `id`
// be sure to include its associated Category and Tag data

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },//find the id parameter 
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name']
        },
      ]
    })
    res.json(product);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

/// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productAssociations = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await Product.bulkCreate(productAssociations);
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating product' });
  }
});

// Update a product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        // Get existing product tags
        Product.findAll({
          where: { id: req.params.id }
        }).then((existingProductTags) => {
          // Create filtered lists of existing and new tag_ids
          const existingTagIds = existingProductTags.map(({ tag_id }) => tag_id);
          const newTagIds = req.body.tagIds.filter((tag_id) => !existingTagIds.includes(tag_id));

          // Prepare new associations
          const newProductTags = newTagIds.map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

          // Figure out which associations to remove
          const associationsToRemove = existingProductTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

          // Run both actions: remove and add associations
          return Promise.all([
            Product.destroy({ where: { id: associationsToRemove } }),
            Product.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (!deleted) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json({ message: 'Product deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

module.exports = router;
