// const express = require('express');
// const packageRouter = express.Router();
// const Packages = require('../../model/admin/packages');
// const adminAuth = require('../../middleware/adminAuthMiddleware');
// const authRouter = require('./authRouter');

// // Create a new package
// packageRouter.post('/', adminAuth, async (req, res) => {
//   try {
//       const { package_id, title, subtitle,description,profileImage,images,dates,offer,price, categories,discountedPrice } = req.body;

//       // Check if trip_plan is provided and contains exactly 3 entries
//     //   if (!trip_plan || trip_plan.length !== 3) {
//     //       return res.status(400).json({ error: 'Each package must include exactly 3 days in trip_plan.' });
//     //   }

//       // Optional: Check if dates length matches the number of trip_plan entries
//       if (!dates ) {
//           return res.status(400).json({ error: 'Each package must include exactly 3 dates.' });
//       }

//       // Create and save the package
//       const newPackage = new Packages({
//           package_id,
//           title,
//           subtitle,
//           description,
//           profileImage,
//           images,
//           dates,
//           offer,
//           price,
//           categories,
//           discountedPrice,
//           offer
//       });
//       await newPackage.save();
      
//       res.status(201).json({ message: 'Package created successfully!', data: newPackage });
//   } catch (err) {
//       res.status(400).json({ error: `Error creating package: ${err.message}` });
//   }
// });

// // Fetch all packages
// packageRouter.get('/', adminAuth, async (req, res) => {
//     try {
//         const packagesData = await Packages.find();
//         console.log('Packages data:', packagesData);
//         res.json(packagesData);
//     } catch (err) {
//         res.status(400).json({ error: `Package fetching error: ${err.message}` });
//     }
// });

// // Fetch packages by category
// packageRouter.get('/:package_id', async (req, res) => {
//     try {
//         const {package_id} = req.params;
//         const selectedPackage = await Packages.find({package_id});



//         console.log(packages)
//         if (packages.length === 0) {
//             return res.status(404).json({ message: 'No packages found in this category' });
//         }

//         res.json(packages);
//     } catch (err) {
//         res.status(400).json({ error: `Error fetching category packages: ${err.message}` });
//     }
// });

// packageRouter.put("/:id", adminAuth, async (req, res) => {
//   const packageId = req.params.id;
//   const { package_id, title, subtitle, category, images, dates, trip_plan } = req.body;

//   try {
//       // Validate that trip_plan includes 3 dates
//       if (trip_plan.length !== 3) {
//           return res.status(400).json({ error: 'Each package must include exactly 3 days in trip_plan.' });
//       }

//       // Update the package
//       const updatedPackage = await Packages.findByIdAndUpdate(
//           packageId,
//           { package_id, title, subtitle, category, images, dates, trip_plan },
//           { new: true, runValidators: true } // new: true returns the updated document
//       );

//       // If package not found
//       if (!updatedPackage) {
//           return res.status(404).json({ message: 'Package not found.' });
//       }

//       res.status(200).json({ message: 'Package updated successfully!', data: updatedPackage });
//   } catch (err) {
//       res.status(400).send("Error updating package: " + err.message);
//   }
// });

// module.exports = packageRouter;


