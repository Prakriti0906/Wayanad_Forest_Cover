var wayanad = ee.FeatureCollection("users/12211001/Wayanad_Boundary");
Map.centerObject(wayanad, 10);

// --- 1. Prepare a Cloud-Free Image for 2019 ---
// CHANGED: The date range is now set to 2019.
var image = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(wayanad)
  .filterDate('2023-01-01', '2023-12-31') // <-- MODIFIED FOR 2019
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(wayanad);

// Display the true-color image to see what we're working with.
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'True-Color Image (2019)');

// --- 2. Calculate Multiple Indices ---

// NDVI = (NIR - Red) / (NIR + Red) -> For Vegetation
var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');

// NDWI = (Green - NIR) / (Green + NIR) -> For Water
var ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');

// NDBI = (SWIR1 - NIR) / (SWIR1 + NIR) -> For Built-up/Barren Land
// We need band B11 for this. Let's add it to our image selection.
// CHANGED: The date range is now set to 2019 for this collection as well.
var image_with_swir = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(wayanad).filterDate('2023-01-01', '2023-12-31') // <-- MODIFIED FOR 2019
  .select(['B8', 'B11']) // Only need NIR and SWIR1
  .median().clip(wayanad);
var ndbi = image_with_swir.normalizedDifference(['B11', 'B8']).rename('NDBI');

// --- 3. Create a High-Quality Binary Mask using Thresholds ---

// Define thresholds (you may need to adjust these for 2019 data by inspecting values)
var ndvi_threshold = 0.4;
var ndwi_threshold = 0.1;
var ndbi_threshold = 0.0;

// Create the mask based on logic:
// 
var forestMask = ndvi.gt(ndvi_threshold)
                 .and(ndwi.lt(ndwi_threshold))
                 .and(ndbi.lt(ndbi_threshold))
                 .rename('forest_mask');

// Display the new, improved mask.
Map.addLayer(forestMask, {min: 0, max: 1, palette: ['yellow', 'green']}, 'High-Quality Mask (2019)');


// --- 4. Set Up Export Tasks for 2023 Data ---
// 
Export.image.toDrive({
  image: image.select(['B4', 'B3', 'B2', 'B8']),
  description: 'Wayanad_4Band_Image_2023', 
  folder: 'GEE_Wayanad_Exports',
  scale: 10,
  region: wayanad.geometry()
});

// 
Export.image.toDrive({
  image: forestMask.toByte(),
  description: 'Wayanad_Forest_Mask_2023', 
  folder: 'GEE_Wayanad_Exports',
  scale: 10,
  region: wayanad.geometry()
});