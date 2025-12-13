const sweetModel = require('../models/sweet.model');

async function createSweet(req, res) {
	try {
		const { name, imageUrl, category, price, quantity, inStock } = req.body;

		const sweet = await sweetModel.create({
			name,
			imageUrl,
			category,
			price,
			quantity,
			inStock,
		});

		return res.status(201).json({
			message: 'Sweet created successfully',
			sweet,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to create sweet',
			error: error.message,
		});
	}
}

async function getAllSweets(req, res) {
	try {
		const sweets = await sweetModel.find();
		return res.status(200).json({message: "Sweets fetched successfully", sweets });
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to fetch sweets',
			error: error.message,
		});
	}
}

async function searchSweets(req, res) {
	try {
		const { name, category, minPrice, maxPrice } = req.query;

		const filter = {};

		if (name) {
			filter.name = { $regex: name, $options: 'i' };
		}

		if (category) {
			filter.category = { $regex: category, $options: 'i' };
		}

		if (minPrice || maxPrice) {
			filter.price = {};
			if (minPrice) {
				filter.price.$gte = Number(minPrice);
			}
			if (maxPrice) {
				filter.price.$lte = Number(maxPrice);
			}
		}

		const sweets = await sweetModel.find(filter);

        if(sweets.length === 0){
            return res.status(404).json({message: "No sweets found matching the criteria"});
        }
        

		return res.status(200).json({message: "Sweets fetched successfully", sweets });
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to search sweets',
			error: error.message,
		});
	}
}

async function updateSweet(req, res) {
	try {
		const { id } = req.params;
		const updates = req.body;

		const sweet = await sweetModel.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!sweet) {
			return res.status(404).json({ message: 'Sweet not found' });
		}

		return res.status(200).json({
			message: 'Sweet updated successfully',
			sweet,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to update sweet',
			error: error.message,
		});
	}
}

async function deleteSweet(req, res) {
	try {
		const { id } = req.params;

		const sweet = await sweetModel.findByIdAndDelete(id);

		if (!sweet) {
			return res.status(404).json({ message: 'Sweet not found' });
		}

		return res.status(200).json({ message: 'Sweet deleted successfully' });
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to delete sweet',
			error: error.message,
		});
	}
}

async function purchaseSweet(req, res) {
	try {
		const { id } = req.params;
		const { quantity = 1 } = req.body;

		if (quantity <= 0) {
			return res.status(400).json({ message: 'Quantity must be greater than 0' });
		}

		const sweet = await sweetModel.findById(id);
		if (!sweet) {
			return res.status(404).json({ message: 'Sweet not found' });
		}

		if (sweet.quantity < quantity) {
			return res.status(400).json({ message: 'Insufficient quantity available' });
		}

	sweet.quantity -= quantity;
	sweet.inStock = sweet.quantity > 0;
	await sweet.save();

		return res.status(200).json({
			message: 'Sweet purchased successfully',
			sweet,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to purchase sweet',
			error: error.message,
		});
	}
}

async function restockSweet(req, res) {
	try {
		const { id } = req.params;
		const { quantity = 1 } = req.body;

		if (quantity <= 0) {
			return res.status(400).json({ message: 'Quantity must be greater than 0' });
		}

		const sweet = await sweetModel.findById(id);
		if (!sweet) {
			return res.status(404).json({ message: 'Sweet not found' });
		}

	sweet.quantity += quantity;
	sweet.inStock = true;
	await sweet.save();

		return res.status(200).json({
			message: 'Sweet restocked successfully',
			sweet,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to restock sweet',
			error: error.message,
		});
	}
}

module.exports = {
	createSweet,
	getAllSweets,
	searchSweets,
	updateSweet,
	deleteSweet,
	purchaseSweet,
	restockSweet,
};

