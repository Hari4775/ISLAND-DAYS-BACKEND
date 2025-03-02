
const express = require("express");
const packageRouter = express.Router();
const Packages = require("../../model/admin/packages")

packageRouter.get('/', async (req, res) => {
    try {
        const packagesData = await Packages.find({}, 'package_id title profileImage price.regular price.discounted offer');
        // const packagesData = await Packages.find();
        console.log('Packages data:', packagesData);
        res.json(packagesData);
    } catch (err) {
        res.status(400).json({ error: `Package fetching error: ${err.message}` });
    }
});

// Fetch packages by category
packageRouter.get('/:_id', async (req, res) => {
    try {
        const {_id} = req.params;
        const selectedPackage = await Packages.find({_id});
        console.log(selectedPackage)
        if (selectedPackage.length === 0) {
            return res.status(404).json({ message: 'No packages found in this category' });
        }

        res.json(selectedPackage);
    } catch (err) {
        res.status(400).json({ error: `Error fetching category packages: ${err.message}` });
    }
});

packageRouter.put("/:id", async (req, res) => {
  const packageId = req.params.id;
  const { package_id, title, subtitle, category, images, dates, trip_plan } = req.body;

  try {
      // Validate that trip_plan includes 3 dates
      if (trip_plan.length !== 3) {
          return res.status(400).json({ error: 'Each package must include exactly 3 days in trip_plan.' });
      }

      // Update the package
      const updatedPackage = await Packages.findByIdAndUpdate(
          packageId,
          { package_id, title, subtitle, category, images, dates, trip_plan },
          { new: true, runValidators: true } // new: true returns the updated document
      );

      // If package not found
      if (!updatedPackage) {
          return res.status(404).json({ message: 'Package not found.' });
      }

      res.status(200).json({ message: 'Package updated successfully!', data: updatedPackage });
  } catch (err) {
      res.status(400).send("Error updating package: " + err.message);
  }
});


module.exports =packageRouter;