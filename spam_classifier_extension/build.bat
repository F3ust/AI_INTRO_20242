@echo off
echo Building Spam Classifier Extension...

echo Installing dependencies...
npm install

echo Building TypeScript...
npm run build

echo Build complete! Extension is ready in 'dist' folder.
echo Load the extension from Chrome://extensions using the 'spam_classifier_extension' folder.
pause 