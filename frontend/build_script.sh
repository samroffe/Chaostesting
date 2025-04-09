#!/bin/bash

# Build the React app
echo "Building React application..."
npm run build

# Clear the Flask static folder
echo "Clearing Flask static folder..."
rm -rf ../static/frontend
mkdir -p ../static/frontend

# Copy the build files to Flask static folder
echo "Copying build files to Flask static folder..."
cp -r dist/* ../static/frontend/

echo "Build and deployment complete!"