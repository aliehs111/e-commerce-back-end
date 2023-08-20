const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

// find all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      attributes: ['id', 'tag_name'],
      include: [
        {
          model: Product,
          attributes: ['product_name']
        },
      ]
    });
    console.log(tags);
    res.json(tags);
  } catch (error) {
    console.log(error); //gives me a more informative error message to research
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// find a single tag by its `id`
// be sure to include its associated Product data 
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'tag_name'],
      include: [
        {
          model: Product,
          attributes: ['product_name']
        },

      ]
    })
    res.json(tag);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }

});


//create new tag
router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body; // Gets the tag_name from the request body

    // Create a new tag using Sequelize create method
    const newTag = await Tag.create({
      tag_name // Pass the tag_name to create the new tag
    });

    res.status(201).json(newTag); // Respond with the newly created tag
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the tag ID parameter
    const { tag_name } = req.body; // Get the updated tag_name from the request body

    // Find the tag by its ID and update its properties
    const updatedTag = await Tag.update(
      { tag_name }, // New tag_name value
      { where: { id } } // Update condition: where ID matches
    );

    res.status(200).json(updatedTag); // Respond with the updated tag
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {

  try {
    const deleted = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (!deleted) {
      res.status(404).json({ message: 'No Tag found with this id!' });
      return;
    }
    res.status(200).json({ message: 'Tag deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

module.exports = router;
