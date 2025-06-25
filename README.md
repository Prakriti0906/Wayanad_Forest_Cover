# Wayanad_Forest_Cover


The main motivation behind this project was that this uses different  types of machine learning  models on 2023 satellite imagery from Google Earth Engine to map and analyze the changes in forest cover for 2019 in **WAYANAD**(KERALA). The goal is to provide an accessible and reproducible workflow for monitoring deforestation and reforestation.


This is a Project on CNN (deep learning model) where the GEE is used to extract the 4-band image of 2023 to train the model by creating patches for training and validation corresponding to the masked image (forest cover) for the corresponding year.


https://github.com/Prakriti0906/Wayanad_Forest_Cover/blob/main/Extracting_GEE_Data/Extracting_Satellite_Images.js: This is the script file used to export the satellite and masked images for the required years.

https://drive.google.com/file/d/1wQjCrvm-ayFAu7qymPHHcbMPQKbpOOkC/view?usp=sharing: Satellite image with required bands for the year 2023.

https://drive.google.com/file/d/1liMT4S4otWfpxJfdP3PqwTvN_NUUIcH0/view?usp=sharing: Masked image(forest and non forest) for the year 2023.

https://github.com/Prakriti0906/Wayanad_Forest_Cover/blob/main/Different_Training_Models/CNN_Wayanad%20(1).ipynb: The script makes use of the CNN model  and then predicts the forest cover for the year (2019) as unseen data for the saved model.
